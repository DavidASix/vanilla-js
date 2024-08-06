const { mat4 } = glMatrix;
const canvas = document.getElementById("test");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL Not Supported");
}

function randomColor() {
  return [Math.random(), Math.random(), Math.random()];
}

// DATA
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
for (let i = 0; i < 6; i++) {
  const rC = randomColor();
  for (let j = 0; j < 6; j++) {
    cubeColors.push(...rC);
  }
}

// BUFFERs
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(cubeVertexData),
  gl.STATIC_DRAW
);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);

//SHADERS
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
    precision mediump float;
    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;

    uniform mat4 matrix;

    void main() {
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
    precision mediump float;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1);
    }
`
);

gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  const info = gl.getProgramInfoLog(program);
  throw new Error(`Could not compile WebGL program. \n\n${info}`);
}

// ENABLE VERTEX ATTRIBUTES
const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

// ENABLE DEPTH INSTEAD OF ORDERED RENDERING
gl.enable(gl.DEPTH_TEST);
const uniformLocations = {
  matrix: gl.getUniformLocation(program, "matrix"),
};

let modelMatrix = mat4.create();
mat4.translate(modelMatrix, modelMatrix, [-0.5, -0.5, -1]);
mat4.scale(modelMatrix, modelMatrix, [0.25, 0.25, 0.25]);
mat4.translate(modelMatrix, modelMatrix, [1.5, 1.5, 0]);

// Perspective Matrix
const projectionMatrix = mat4.create();
mat4.perspective(
  projectionMatrix,
  (55 * Math.PI) / 180,
  canvas.width / canvas.height,
  1e-4,
  1e4
);

// Camera Matrix
const cameraMatrix = mat4.create();
// Where you want to move the camera
mat4.translate(cameraMatrix, cameraMatrix, [-0.25, 0, 0]);
// camera must be inverted as it is our eyes
mat4.invert(cameraMatrix, cameraMatrix);

const pmMatrix = mat4.create();
const finalMatrix = mat4.create();

function animate() {
  requestAnimationFrame(animate);
  mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 200);
  mat4.multiply(pmMatrix, projectionMatrix, modelMatrix);
  mat4.multiply(finalMatrix, cameraMatrix, pmMatrix);
  gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, cubeVertexData.length / 3);
}

animate();
