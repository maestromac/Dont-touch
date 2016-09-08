let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
function Block (x, dy, w, h, color, m, y, tx) {
  // tx is target x
  // m  is dx multiplier
  this.x = x;
  this.y = y;
  this.dy = dy;
  this.w = w;
  this.h = h;
  this.tx = tx;
  this.dx = w/canvas.width * m;
  this.color = color;
  this.inFrame = true;
}

Block.prototype.draw = function () {
  ctx.beginPath();
  if (this.x < 0) {
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;

    ctx.fill();
    ctx.closePath();
    this.x += this.dx;
    if (this.x > 0) {
      this.x = 0;
    }
  } else if (this.tx && this.x > this.tx) {
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    this.x -= this.dx;
    if (this.x < this.tx) {
      this.x = this.tx;
    }
  } else {
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    this.y += this.dy;
    if (this.y === canvas.height) {
      this.inFrame = false;
    }
  }
};

module.exports = Block;
