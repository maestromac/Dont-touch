const Util = {
  getMousePos (rect, e) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  },

  fairRandom(max, min) {
    let randomized = Math.random() * max;
    if (randomized < min) { randomized = min; }
    return randomized;
  },

  RectCircleColliding (circle, rect) {
    let distX = Math.abs(circle.x - rect.x-rect.w/2);
    let distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; }
    if (distY <= (rect.h/2)) { return true; }

    let dx=distX-rect.w/2;
    let dy=distY-rect.h/2;
    return (dx*dx+dy*dy <= (circle.r*circle.r));
  },

  getRndColor (transparent) {
    let r = Math.floor(Math.random() * 255);
  	let g = Math.floor(Math.random() * 255);
  	let b = Math.floor(Math.random() * 255);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + transparent + ')';
}

};

module.exports = Util;
