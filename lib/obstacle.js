const Block = require('./block.js');
const Util = require('./util.js');
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let blockLeftCenter;
let blockRightCenter;

function Obstacle(gap, gapLocation, dy, height, color, m, y) {
  this.gap = gap;
  this.y = y ? y : 0;
  this.gapLocation = gapLocation + gap > canvas.width ?
      (canvas.width - gap) : gapLocation;

  if (this.gapLocation === 0 ) {
    blockRightCenter = this.gap;
  } else if (this.gapLocation === canvas.width) {
    // blockLeftCenter = 0;
    blockLeftCenter = 0 - this.gapLocation;
  } else {
    // blockLeftCenter = 0;
    blockLeftCenter = 0 - this.gapLocation;
    blockRightCenter = this.gap + this.gapLocation;
  }

  if (blockLeftCenter || blockLeftCenter === 0) {
    this.blockLeft = new Block(
      blockLeftCenter, dy, this.gapLocation, height, color, m, this.y
    );
  }

  if (blockRightCenter || blockRightCenter === 0 ) {
    this.blockRight = new Block(
      // blockRightCenter, dy, canvas.width - blockRightCenter, height
      canvas.width, dy, canvas.width - blockRightCenter, height, color, m, this.y, blockRightCenter
    );
  }
}

Obstacle.prototype.draw = function () {
  if (this.blockLeft && this.blockLeft.inFrame) {
    this.blockLeft.draw();
  }
  if (this.blockRight && this.blockRight.inFrame) {
    this.blockRight.draw();
  }
};

Obstacle.prototype.inFrame = function () {
  let inFrameLeft = this.blockLeft.inFrame;
  let inFrameRight = this.blockRight.inFrame;
  if (inFrameRight === false || inFrameLeft === false) {
    return false;
  }
  return true;
};

Obstacle.prototype.detectCollision = function (cursor) {
  let leftDetection = Util.RectCircleColliding(cursor, this.blockLeft);
  let rightDetection = Util.RectCircleColliding(cursor, this.blockRight);
  if (leftDetection || rightDetection) {
    return true;
  }
  return false;
};


module.exports = Obstacle;
