const Util = require('./util.js');

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();

function Cursor (x, y, r, maxCursors) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.maxCursors = maxCursors;
  this.positions = [];
  document.addEventListener(
    "mousemove", this.mouseMoveHandler.bind(this), false
  );
}

Cursor.prototype.mouseMoveHandler = function (e) {
  let pos = Util.getMousePos(rect, e);
  this.x = pos.x;
  this.y = pos.y;
};

Cursor.prototype.draw = function () {
  for (let i = 0; i < this.positions.length; i++) {
    let ratio = (i + 1) / this.positions.length;
    ctx.beginPath();
    ctx.arc(this.positions[i].x, this.positions[i].y, (ratio*this.r), 0, Math.PI*2);
    ctx.fillStyle = "rgba(181,18,18, " + ratio*this.r + ")";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
  ctx.fillStyle = "rgb(181,18,18)";
  ctx.fill();
  ctx.closePath();
  this.storeLastPosition(this.x, this.y);
};

Cursor.prototype.outOfFrame = function () {
  let xInFrame = this.x <= canvas.width && this.x >= 0;
  let yInFrame = this.y <= canvas.height && this.y >= 0;

  if (xInFrame === false || yInFrame === false) {
    return true;
  }
  return false;
};

Cursor.prototype.storeLastPosition = function (x, y) {
  this.positions.push({ x: x, y: y});
  if (this.positions.length > this.maxCursors) {this.positions.shift();}
};

module.exports = Cursor;
