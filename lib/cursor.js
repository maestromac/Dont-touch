const Util = require('./util.js');

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();

function Cursor (x, y, ballRadius) {
  this.x = x;
  this.y = y;
  this.ballRadius = ballRadius;
  document.addEventListener(
    "mousemove", this.mouseMoveHandler.bind(this), false
  );
}

Cursor.prototype.mouseMoveHandler = function (e) {
  let pos = Util.getMousePos(rect, e);
  this.x = pos.x;
  this.y = pos.y;
};

Cursor.prototype.drawBall = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#990000";
  ctx.fill();
  ctx.closePath();
};

Cursor.prototype.draw = function () {
  this.drawBall();
};

// Cursor.prototype.place = function () {
//   setInterval(this.draw.bind(this), 10);
// };

module.exports = Cursor;
