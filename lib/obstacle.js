const Block = require('./block.js');
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let blockLeftCenter;
let blockRightCenter;

function Obstacle(gap, gapLocation, dy, height) {
  this.gap = gap;
  this.gapLocation = gapLocation;
  // this.gap = Math.random() * (0.1 * canvas.width);
  // this.gapLocation = Math.random() * canvas.width;


  if (this.gapLocation === 0 ) {
    blockRightCenter = this.gap;
  } else if (this.gapLocation === canvas.width) {
    this.gapLocation -= this.gap;
    blockLeftCenter = 0;
  } else {
    blockLeftCenter = 0;
    blockRightCenter = this.gap + this.gapLocation;
  }

  if (blockLeftCenter || blockLeftCenter === 0) {
    this.blockLeft = new Block(
      // blockLeftCenter, dy, canvas.width - this.gapLocation, height
      blockLeftCenter, dy, this.gapLocation, height
    );
  }

  if (blockRightCenter || blockRightCenter === 0 ) {
    this.blockRight = new Block(
      blockRightCenter, dy, canvas.width - blockRightCenter, height
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


module.exports = Obstacle;
