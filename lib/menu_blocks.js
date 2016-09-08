let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
const Obstacle = require('./obstacle.js');
const Util = require('./util.js');

let colorsLength = Util.colors.length;
let colorsIdx = Math.floor(Math.random() * (colorsLength - 1));

function MenuBlocks(num, speed, black) {
  this.yCoord = 0;
  this.height = canvas.height/num;
  this.color = Util.colors[colorsIdx % colorsLength];
  this.obstacles = [];
  if (black === true) {
    this.color = "#111111";
  }
  for (let i = 0; i < num; i++) {
    this.obstacles.push(new Obstacle(
      0,
      Util.fairRandom(canvas.width),
      0,
      this.height,
      this.color,
      speed,
      this.yCoord
    ));
    if (black === undefined) {
      colorsIdx += 1;
      this.color = Util.colors[colorsIdx % colorsLength];
    }
    this.yCoord += this.height;
  }
  this.done = false;
}

MenuBlocks.prototype.draw = function () {
  if (this.done === false) {
    this.obstacles.forEach( (obs) => {
      obs.draw();
    });
    if (this.obstacles[this.obstacles.length - 1].blockLeft.x === 0) {
      Util.sleep(50).then(() => {
        this.done = true;
      });
    }

  }
};

module.exports = MenuBlocks;
