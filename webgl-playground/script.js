//import {glMatrix} from './gl-matrix.js';

const { mat4 } = glMatrix;
const canvas = document.getElementById("test");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL Not Supported");
}

function randomColor() {
  return [Math.random(), Math.random(), Math.random()];
}

// Draw a triangle
const vertexData = [
  //x, y, z
  //1
  0, 0.707, 0,
  // 2
  1, -1, 0,
  // 3
  -1, -1, 0,
];
const colorData = [...randomColor(), ...randomColor(), ...randomColor()];

const cubeVertexData = [
  // F1
  0, 1, 0, 1, 1, 0, 1, 0, 0,
  //F2
  0, 1, 0, 0, 0, 0, 1, 0, 0,
  // L1
  0, 1, -1, 0, 1, 0, 0, 0, 0,
  //L2
  0, 1, -1, 0, 0, -1, 0, 0, 0,
  // R1
  1, 1, 0, 1, 1, -1, 1, 0, -1,
  // R2
  1, 1, 0, 1, 0, 0, 1, 0, -1,
  // T1
  0, 1, -1, 1, 1, -1, 1, 1, 0,
  //T2
  0, 1, -1, 0, 1, 0, 1, 1, 0,
  // B1
  0, 0, 0, 1, 0, 0, 1, 0, -1,
  // B2
  0, 0, 0, 0, 0, -1, 1, 0, -1,
  // Bk 1
  1, 1, -1, 0, 1, -1, 0, 0, -1,
  // Bk 2
  1, 1, -1, 1, 0, -1, 0, 0, -1,
];

// Add 6 of the same color per, 6 times. Totals 6 colors coloring 36 vertices
const cubeColors = [];
for (let i = 0; i < 6; i++ ) {
  const rC = randomColor();
  for (let j = 0; j < 6; j++) {
    cubeColors.push(...rC)
  }
}

const positionBuffer = gl.createBuffer();
// Set our above buffer as the current Array buffer (an array of vertex data)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Set the vertex data to our buffer
// (what are we writing to, the data we are writing, how often it gets updated [static, dynamic])
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertexData), gl.STATIC_DRAW);

// COLOR BUFFER
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);

//SHADERS

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// Vertex source is strongly typed, style enforced.
gl.shaderSource(
  vertexShader,
  `
    // Set the preceision of the floating point numbers
    // lowp, mediump, highp
    precision mediump float;
    // set up a 3 variable vecter based on the position of the vecter
    // This also shows which attributes we have to enable after the program is linked
    attribute vec3 position;
    attribute vec3 color;
    // The below var connects to the frag shader to allow it to access the color
    varying vec3 vColor;

    // We'll assign values to this which will agument the output
    uniform mat4 matrix;

    void main() {
        // gl_position === output of vertex container
        // Use our position, plus a 1 to make it a 4 variable vector
        vColor = color;
        gl_Position = matrix * vec4(position, 1);
    }
    `
);

gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
    // Set the preceision of the floating point numbers
    // lowp, mediump, highp
    precision mediump float;
    varying vec3 vColor;
    void main() {
        //RGBA vec4
        gl_FragColor = vec4(vColor, 1);
    }
`
);

gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
// link is like compiling to check if there are problems.
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  const info = gl.getProgramInfoLog(program);
  throw new Error(`Could not compile WebGL program. \n\n${info}`);
}

// Enabling vertex atttributes
const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
// Describe to webgl how to retrieve data from current buffer
// (where is the attrib, how many values to parse per attribe, what is their type?, NORMALIZE, STRIDE, OFFSET)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

// After using the program, you can apply translations to the vectors
// this is done by multiplying the
let matrix = mat4.create();
// (output, input, change)
mat4.scale(matrix, matrix, [0.5, 0.5, 0.5])
//mat4.rotateZ(matrix, matrix, Math.PI / 2)
//mat4.translate(matrix, matrix, [0.1,0.5,0])

// Enabling depth changes from rendering vertexs in order they appear in array to their appropriate depth
gl.enable(gl.DEPTH_TEST);
const uniformLocations = {
  matrix: gl.getUniformLocation(program, "matrix"),
};

function animate() {
  requestAnimationFrame(animate);
  mat4.rotateZ(matrix, matrix, Math.PI / 800);
  mat4.rotateY(matrix, matrix, Math.PI / 200);
  mat4.rotateX(matrix, matrix, Math.PI / 400);
  // (location of value we're editting, should be transposed, input matrix)
  gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
  // (What are we drawing, what is the starting vertex, how many vertexes to draw )
  gl.drawArrays(gl.TRIANGLES, 0, cubeVertexData.length / 3);
}

animate();
