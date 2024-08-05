import utils from "./utils.js";

export default class Player {
  constructor(ctx, playerNumber) {
    this.ctx = ctx;
    this.playerNumber = playerNumber;
    this.width = 20;
    this.height = 80;
    // Defines the direction the player sends the ball when they hit it
    this.playerSendDirection = playerNumber === 1 ? 1 : -1;
    this.position = {
      x: playerNumber === 1 ? 10 : 990 - this.width,
      y: 500 - this.height / 2,
    };
    this.speed = 15;
    this.moving = false; // is false, "up" or "down"
  }

  detectBallCollision(ball) {
    const ballAbovePaddle = ball.position.y < this.position.y;
    if (ballAbovePaddle) {
      // No Collision Possible as paddles are drawn below origin
      return;
    }

    // Check if the ball is within 1.8 of the paddle, on x axis
    let xAxisDifferenceInOrigin = ball.position.x - this.position.x;
    xAxisDifferenceInOrigin = Math.abs(xAxisDifferenceInOrigin);
    xAxisDifferenceInOrigin -= ball.radius;
    xAxisDifferenceInOrigin -= this.width * (this.playerNumber === 2 ? 0 : 1);

    if (xAxisDifferenceInOrigin < 1.8) {
      // As ball and paddle origins are +- 1 on x-axis,
      // the hypotenuse is essential the distance between origins on y
      const distBetweenOrigins = utils.distanceBetween(ball, this);
      if (distBetweenOrigins <= this.height) {
        // Adjust ball speed if the paddle is moving
        // Player send direction is changed after speed is adjusted, to ensure
        // Speed isn't adjusted more than once per collision
        if (this.moving && ball.velocity.x.dir !== this.playerSendDirection) {
          const spdChgPerc = 0.2;
          const increase = (current, base) =>
            Math.min(current * (1 + spdChgPerc), base * 1.5);
          const decrease = (current, base) =>
            Math.max(current / (1 + spdChgPerc), base / 2);

          // Ball Up
          if (ball.velocity.y.dir === -1) {
            if (this.moving === "up") {
              // Paddle Up
              ball.velocity.y.speed = increase(
                ball.velocity.y.speed,
                ball.baseSpeed
              );
              ball.velocity.x.speed = increase(
                ball.velocity.x.speed,
                ball.baseSpeed
              );
            } else {
              // Paddle Down
              ball.velocity.y.speed = decrease(
                ball.velocity.y.speed,
                ball.baseSpeed
              );
              ball.velocity.x.speed = decrease(
                ball.velocity.x.speed,
                ball.baseSpeed
              );
            }
          } else {
            // Ball down
            if (this.moving === "up") {
              // Paddle Up
              ball.velocity.y.speed = decrease(
                ball.velocity.y.speed,
                ball.baseSpeed
              );
              ball.velocity.x.speed = decrease(
                ball.velocity.x.speed,
                ball.baseSpeed
              );
            } else {
              // Paddle Down
              ball.velocity.y.speed = increase(
                ball.velocity.y.speed,
                ball.baseSpeed
              );
              ball.velocity.x.speed = increase(
                ball.velocity.x.speed,
                ball.baseSpeed
              );
            }
          }
        }
        // If paddle origin is within the height above the ball origin
        // change directions.
        ball.velocity.x.dir = this.playerSendDirection;
      }
    }
  }

  move() {
    if (this.position.y >= 1000 - this.height && this.moving === "down") {
      this.position.y = 1000 - this.height;
    } else if (this.position.y <= 0 && this.moving === "up") {
      this.position.y = 0;
    } else {
      const positionChange = this.moving === "up" ? -this.speed : this.speed;
      this.position = { ...this.position, y: this.position.y + positionChange };
    }
  }

  draw() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    // Origin Indicator
    // TODO: Remove
    // this.ctx.fillStyle = "red";
    // this.ctx.fillRect(this.position.x, this.position.y, 4, 4);
  }
}
