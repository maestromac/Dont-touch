const Util = {
  getMousePos (rect, e) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  },
};

module.exports = Util;
