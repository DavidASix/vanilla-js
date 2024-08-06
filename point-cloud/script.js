const { mat4, vec3 } = glMatrix;
const canvas = document.getElementById("test");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL Not Supported");
}

function randomColor() {
  return [Math.random(), Math.random(), Math.random()];
}

function spherePointCloud(pointCount) {
  let points = [];
  for (let i = 0; i < pointCount; i++) {
    const rPoint = () => Math.random() - 0.5;
    const point = [rPoint(), rPoint(), rPoint()]
    // Vec3 normalize maintains the direction of a vector but changes its length to the origin to 1
    const normalizedPoint = vec3.normalize(vec3.create(), point)
    points.push(...normalizedPoint)
  }
  return points;
}

const pointCount = 5e4

// BUFFERs
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(spherePointCloud(pointCount)),
  gl.STATIC_DRAW
);

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
        vColor = vec3(position.xy, 0.5);
        gl_Position = matrix * vec4(position, 1);
        gl_PointSize = 2.0;
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

gl.useProgram(program);

// ENABLE DEPTH INSTEAD OF ORDERED RENDERING
gl.enable(gl.DEPTH_TEST);
const uniformLocations = {
  matrix: gl.getUniformLocation(program, "matrix"),
};

let modelMatrix = mat4.create();
mat4.translate(modelMatrix, modelMatrix, [0, 0, -3]);
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
mat4.translate(cameraMatrix, cameraMatrix, [0, 0, 0]);
// camera must be inverted as it is our eyes
mat4.invert(cameraMatrix, cameraMatrix);

const pmMatrix = mat4.create();
const finalMatrix = mat4.create();

function animate() {
  requestAnimationFrame(animate);
  mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 400);
  mat4.multiply(pmMatrix, projectionMatrix, modelMatrix);
  mat4.multiply(finalMatrix, cameraMatrix, pmMatrix);
  gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
  gl.drawArrays(gl.POINTS, 0, pointCount / 3);
}

animate();
