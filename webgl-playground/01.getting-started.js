const canvas = document.getElementById("test");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL Not Supported");
}

/*
FLOW OF WEB GL
Setup vertex data
Load verticies into buffer (place on GPU)
Create a vertex shader (reconfigs the verticies to their correct location)
Create a fragment shader (Takes the vertex data and paints each pixel on the screen)
Create a program
Attach the shaders to the program
Enable vertex attributes (select which attributes are being considered
    Position, Color, Normal [direction its facing])
Draw to the screen
*/

const vertexData = [
  //x, y, z
  0,
  1,
  0, //1
  1,
  -1,
  0, // 2
  -1,
  -1,
  0, // 3
];

const colorData = [
  1,
  0,
  0, // c1
  1,
  1,
  0, // c2
  1,
  0,
  1, //c3
];

const positionBuffer = gl.createBuffer();
// Set our above buffer as the current Array buffer (an array of vertex data)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Set the vertex data to our buffer
// (what are we writing to, the data we are writing, how often it gets updated [static, dynamic])
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// COLOR BUFFER
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

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

    void main() {
        // gl_position === output of vertex container
        // Use our position, plus a 1 to make it a 4 variable vector
        vColor = color;
        gl_Position = vec4(position, 1);
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
// (What are we drawing, what is the starting vertex, how many vertexes to draw )
gl.drawArrays(gl.TRIANGLES, 0, 3);
