let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();

function Block (x, dy, w, h) {
  this.x = x;
  this.y = -300;
  this.dy = dy;
  this.w = w;
  this.h = h;
  this.inFrame = true;
}

Block.prototype.draw = function () {
  ctx.beginPath();
  ctx.rect(this.x, this.y, this.w, this.h);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  this.y += this.dy;
  if (this.y === canvas.height) {
    this.inFrame = false;
  }
};

module.exports = Block;
