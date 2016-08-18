let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();

function Block (x, dy, width, height) {
  this.x = x;
  this.y = -500;
  this.dy = dy;
  this.width = width;
  this.height = height;
  this.inFrame = true;
}

Block.prototype.draw = function () {
  ctx.beginPath();
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  this.y += this.dy;
  if (this.y + this.dy > canvas.height + (this.height*2)) {
    this.inFrame = false;
  }
};

module.exports = Block;
