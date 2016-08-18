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
  }
};

module.exports = Util;
