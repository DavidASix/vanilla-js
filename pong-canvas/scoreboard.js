export default class Scoreboard {
  constructor(ctx, winningScore) {
    this.ctx = ctx;
    this.player1 = 0;
    this.player2 = 0;
    this.winningScore = winningScore;
    this.btnHovered = false
  }

  draw() {
    this.ctx.fillStyle = "white";
    const size = 50;
    this.ctx.font = `normal bold ${size}px Work Sans`;
    this.ctx.fillText(`${this.player1}`, 60, size + 25);
    this.ctx.fillText(`${this.player2}`, 900, size + 25);
  }

  drawInstructions() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 48px Bricolage Grotesque";
    let text = "Press a key to start";
    let textMetrics = this.ctx.measureText(text);
    let textWidth = textMetrics.width;
    this.ctx.fillText(text, 500 - textWidth / 2, 48 + 100);

    this.ctx.font = "normal 200 36px Work Sans";
    text = `First to ${this.winningScore} wins`;
    textMetrics = this.ctx.measureText(text);
    textWidth = textMetrics.width;
    this.ctx.fillText(text, 500 - textWidth / 2, 48 + 100 + 36 + 10);
  }

  drawWinScreen() {
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 48px Bricolage Grotesque";
    const winner = this.player1 > this.player2 ? 1 : 2;
    let text = `Player ${winner} Wins!`;
    let textMetrics = this.ctx.measureText(text);
    let textWidth = textMetrics.width;
    this.ctx.fillText(text, 500 - textWidth / 2, 500 - 48);

    this.ctx.font = "normal 200 36px Work Sans";
    text = `Final Score ${this.player1} to ${this.player2}`;
    textMetrics = this.ctx.measureText(text);
    textWidth = textMetrics.width;
    this.ctx.fillText(text, 500 - textWidth / 2, 500);

    this.ctx.fillStyle = this.btnHovered ? "#58B09C" : "white";
    this.ctx.font = "normal 800 36px Work Sans";
    text = `Play Again`;
    textMetrics = this.ctx.measureText(text);
    textWidth = textMetrics.width;
    this.ctx.fillText(text, 500 - textWidth / 2, 500 + 36 + 100);

    // Draw box around button
    const padding = {
      x: 40,
      y: 20,
    };
    let boxDims = {
      width: textMetrics.width + padding.x * 2,
      height:
        textMetrics.emHeightAscent +
        textMetrics.emHeightDescent +
        padding.y * 2,
    };
    boxDims.x = 500 - boxDims.width / 2;
    boxDims.y = 500 + 100 + 36 - textMetrics.emHeightAscent - padding.y;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.btnHovered ? "#58B09C" : "white";
    this.ctx.roundRect(boxDims.x, boxDims.y, boxDims.width, boxDims.height, 10);
    this.ctx.stroke();
  }
}
