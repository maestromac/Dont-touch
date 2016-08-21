const Util = require('./util.js');

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();

function Cursor (x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  document.addEventListener(
    "mousemove", this.mouseMoveHandler.bind(this), false
  );
}

Cursor.prototype.mouseMoveHandler = function (e) {
  let pos = Util.getMousePos(rect, e);
  this.x = pos.x;
  this.y = pos.y;
  // console.log(`${this.x}, ${this.y}`);
};

Cursor.prototype.drawBall = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
  ctx.fillStyle = "#990000";
  ctx.fill();
  ctx.closePath();
};

Cursor.prototype.outOfFrame = function () {
  let xInFrame = this.x <= canvas.width && this.x >= 0;
  let yInFrame = this.y <= canvas.height && this.y >= 0;

  if (xInFrame === false || yInFrame === false) {
    return true;
  }
  return false;
};

Cursor.prototype.draw = function () {
  this.drawBall();
};

module.exports = Cursor;
