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

// Enabling depth changes from rendering vertexs in order they appear in array to their appropriate depth
gl.enable(gl.DEPTH_TEST);
const uniformLocations = {
  matrix: gl.getUniformLocation(program, "matrix"),
};


// After using the program, you can apply translations to the vectors
// this is done by multiplying the
let modelMatrix = mat4.create();
// (output, input, change)
//mat4.rotateZ(matrix, matrix, Math.PI / 1)
mat4.translate(modelMatrix, modelMatrix, [-0.5, -0.5, -1])
mat4.scale(modelMatrix, modelMatrix, [0.25, 0.25, 0.25])
mat4.translate(modelMatrix, modelMatrix, [1.5, 1.5, 0])
mat4.translate(modelMatrix, modelMatrix, [0, 0, 0])


// Perspective Matrix
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix,
    55 * Math.PI/180, // vertical FOV (angle, radians)
    canvas.width / canvas.height, //aspect ratio w/h
    1e-4, // near cull distance (how close to camera can you get before going through it). Can't be zero, but should be small
    1e4, //render disntace (far cull distance)
  )

// Camera Matrix
// Camera isn't really a thing, so we apply the inverse of what we want the camera
// to do, to the rest of the world. Camera stands still and world moves.
const cameraMatrix = mat4.create();
// Where you want to move the camera
mat4.translate(cameraMatrix,cameraMatrix, [-0.25,0,0])
// camera must be inverted as it is our eyes
mat4.invert(cameraMatrix, cameraMatrix)

const pmMatrix = mat4.create();
const finalMatrix = mat4.create();

function animate() {
  requestAnimationFrame(animate);
  // Reset model matrix to identity
  mat4.identity(modelMatrix);

  // Apply transformations
  mat4.translate(modelMatrix, modelMatrix, [-0.5, -0.5, -1]); // Initial translation
  mat4.scale(modelMatrix, modelMatrix, [0.25, 0.25, 0.25]);   // Scaling
  mat4.translate(modelMatrix, modelMatrix, [1.5, 1.5, 0]);    // Move to the new position

  // Apply rotation around the center
  mat4.translate(modelMatrix, modelMatrix, [0.5, 0.5, 0]);    // Translate to center of cube
  mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 200);       // Rotate around Y-axis
  mat4.translate(modelMatrix, modelMatrix, [-0.5, -0.5, 0]);   // Translate back from center

  // Compute the final matrix
  mat4.multiply(finalMatrix, projectionMatrix, modelMatrix);
  // (location of value we're editting, should be transposed, input matrix)
  gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
  // (What are we drawing, what is the starting vertex, how many vertexes to draw )
  gl.drawArrays(gl.TRIANGLES, 0, cubeVertexData.length / 3);
}

animate();
