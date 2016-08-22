# Don't touch!
[Live](https://maestromac.github.io/Dont-touch/)

## About

"Don't Touch" is a simple and addictive cursor-avoidance game. You maintain your cursor within the frame and avoid incoming blocks. Each blocks are randomly generated.

## How to Play
1. Keep your cursor within the frame.
2. Avoid all incoming blocks.
3. Stay alive as long as possible.
4. Try to beat your previous score!

## Technical Details

### Obstacles

```JavaScript
function Obstacle(gap, gapLocation, dy, height) {
  this.gap = gap;
  this.gapLocation = gapLocation + gap > canvas.width ?
      (canvas.width - gap) : gapLocation;

  if (this.gapLocation === 0 ) {
    blockRightCenter = this.gap;
  } else if (this.gapLocation === canvas.width) {
    blockLeftCenter = 0;
  } else {
    blockLeftCenter = 0;
    blockRightCenter = this.gap + this.gapLocation;
  }

  if (blockLeftCenter || blockLeftCenter === 0) {
    this.blockLeft = new Block(
      blockLeftCenter, dy, this.gapLocation, height
    );
  }

  if (blockRightCenter || blockRightCenter === 0 ) {
    this.blockRight = new Block(
      blockRightCenter, dy, canvas.width - blockRightCenter, height
    );
  }
}
```
Obstacles(a pair of blocks) are randomly generated. Since the location of the gap is randomly selected, Obstacle constructor will automatically adjust gap location if 0 or the maximum width is picked in relation to the width.

### Efficient rendering

```JavaScript
Obstacle.prototype.inFrame = function () {
  let inFrameLeft = this.blockLeft.inFrame;
  let inFrameRight = this.blockRight.inFrame;
  if (inFrameRight === false || inFrameLeft === false) {
    return false;
  }
  return true;
};

Game.prototype.removeObstacle = function () {
  let target = this.obstacles[0].inFrame() ? undefined : 0;

  if (target === 0) {
    this.obstacles.splice(target, 1);
  }
};
```
Obstacle are stored in an array and will automatically be removed once they are out of frame, keeping the game smooth no matter how long the player last.

## Future Features

[ ] automatically adjust difficulty base on player's score.
[ ] store record of highest scores and user name.
