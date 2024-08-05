export default class Ball {
  constructor(ctx) {
    this.ctx = ctx;
    this.radius = 20;
    this.position = {
      x: 500,
      y: 500,
    };
    this.moving = false;
    this.velocity = {
      x: { dir: 0, speed: 0 },
      y: { dir: 0, speed: 0 },
    };
    this.baseSpeed = 3.5;
  }

  startPlay() {
    this.moving = true;
    const halfSpeed = this.baseSpeed / 2;
    this.velocity = {
      x: {
        dir: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * halfSpeed + halfSpeed,
      },
      y: {
        dir: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * halfSpeed + halfSpeed,
      },
    };
  }

  detectUpperLowerCollisions() {
    // Detects a collision with the floor or ceiling, then redirects the ball accordingly
    let ballY = this.position.y;
    if (ballY <= 0 + this.radius || ballY >= 1000 - this.radius) {
      this.velocity.y.dir *= -1;
    }
  }

  move() {
    if (!this.moving) {
      return;
    }
    this.position = {
      x:
        this.position.x +
        this.velocity.x.dir * this.velocity.x.speed * this.baseSpeed,
      y:
        this.position.y +
        this.velocity.y.dir * this.velocity.y.speed * this.baseSpeed,
    };
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 360);
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "#f0f0f0";
    this.ctx.fill();
    this.ctx.stroke();
    // Indicator Dot
    // TODO: Remove
    // this.ctx.beginPath();
    // this.ctx.arc(this.position.x, this.position.y, 1, 0, 360);
    // this.ctx.fillStyle = "red";
    // this.ctx.fill();
  }
}
