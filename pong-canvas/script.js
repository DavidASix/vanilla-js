import Ball from "./ball.js";
import Player from "./player.js";
import Scoreboard from "./scoreboard.js";

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const keyIndW = document.getElementById("key-ind-w");
const keyIndS = document.getElementById("key-ind-s");
const keyIndUp = document.getElementById("key-ind-up");
const keyIndDown = document.getElementById("key-ind-down");

const winningScore = 5;

let ball = new Ball(ctx);
let player1 = new Player(ctx, 1);
let player2 = new Player(ctx, 2);
const scoreboard = new Scoreboard(ctx, winningScore);

let keys = {};

function resetGameplayState() {
  ball = new Ball(ctx);
  player1 = new Player(ctx, 1);
  player2 = new Player(ctx, 2);
  keys = {};
}

addEventListener("keydown", (e) => {
  e.preventDefault()
  keys[e.code] = true;
});

addEventListener("keyup", (e) => {
  e.preventDefault()
  keys[e.code] = false;
});

canvas.addEventListener('mouseover', (e) => {
    console.log(e)
})

canvas.addEventListener('click', (e) => {
    console.log(e)
})

function gameLoop() {
  setTimeout(() => {
    // Clear KBD indicator styles
    keyIndW.classList.remove("kbd-key-active");
    keyIndS.classList.remove("kbd-key-active");
    keyIndUp.classList.remove("kbd-key-active");
    keyIndDown.classList.remove("kbd-key-active");
    // Reset player moving state

    player1.moving = false;
    player2.moving = false;

    // Clear Screen
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(0, 0, 1000, 1000);

    // Handle Score Increments
    if (ball.position.x < -100) {
      // Ball has gone off left of screen
      scoreboard.player2 += 1;
      // TODO: Move this reset somewhere after the winning screen is shown to prevent flashes
      resetGameplayState();
    } else if (ball.position.x > 1100) {
      // Ball has gone off right of screen
      scoreboard.player1 += 1;
      resetGameplayState();
    }

    // Check for win condition and show winner screen
    if (
      scoreboard.player1 === winningScore ||
      scoreboard.player2 === winningScore
    ) {
      console.log("winner");
      scoreboard.drawWinScreen();
      return gameLoop();
    }

    // Check if any key has been pressed, if not start the ball moving
    if (!ball.moving) {
      if (Object.values(keys).some((v) => v)) {
        // Ball is not moving, but someone has clicked a key.
        // Start the ball moving, and game playing
        ball.startPlay();
      } else {
      }
    }

    // Handle keydowns
    if (keys.KeyW) {
      player1.moving = "up";
      player1.move();
      keyIndW.classList.add("kbd-key-active");
    }
    if (keys.KeyS) {
      player1.moving = "down";
      player1.move();
      keyIndS.classList.add("kbd-key-active");
    }
    if (keys.ArrowUp) {
      player2.moving = "up";
      player2.move();
      keyIndUp.classList.add("kbd-key-active");
    }
    if (keys.ArrowDown) {
      player2.moving = "down";
      player2.move();
      keyIndDown.classList.add("kbd-key-active");
    }

    // Check for collisions
    ball.detectUpperLowerCollisions();
    player1.detectBallCollision(ball);
    player2.detectBallCollision(ball);

    // Handle Ball Move
    ball.move();

    // Draw elements to screen
    ball.draw();
    player1.draw();
    player2.draw();
    scoreboard.draw();
    if (!ball.moving) {
      scoreboard.drawInstructions();
    }

    if (!keys["Escape"]) {
      gameLoop();
    }
  }, 1000 / 30);
}
gameLoop();
