/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cursor = __webpack_require__(1);
	var Obstacle = __webpack_require__(3);
	var Util = __webpack_require__(2);
	var MenuBlocks = __webpack_require__(5);
	
	var colorsIdx = 0;
	var colorsLength = Util.colors.length;
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	var ballRadius = 8;
	
	var level = 1;
	var difficulty = {
	  gap: Util.fairRandom(0.23 * canvas.width, 0.23 * canvas.width),
	  gapLocation: Util.fairRandom(canvas.width),
	  dy: 0.7,
	  height: Util.fairRandom(40, 40),
	  color: Util.colors[colorsIdx % colorsLength],
	  m: 7
	};
	
	var interval1 = void 0;
	var interval2 = void 0;
	var interval3 = void 0;
	var menuInterval = void 0;
	var blackInterval = void 0;
	var scoreInterval = void 0;
	
	var mouseClickListener = void 0;
	var listenerCount = 0;
	var retryCallback = void 0;
	var menuCallback = void 0;
	
	function Game() {
	  this.cursor = new Cursor(x, y, ballRadius, 40);
	  this.score = 0;
	  this.status = "intro";
	  this.obstacles = [];
	  this.menuBlocks = new MenuBlocks(13, 4);
	  this.blackBlocks = new MenuBlocks(13, 4, true);
	}
	
	Game.prototype.generateObstacle = function () {
	  this.obstacles.push(new Obstacle(difficulty.gap, difficulty.gapLocation, difficulty.dy, difficulty.height, difficulty.color, difficulty.m));
	  colorsIdx += 1;
	  if (level < 10) {
	    this.raiseDifficulty();
	  } else {
	    this.sustainDifficulty();
	  }
	  this.removeObstacle();
	};
	
	Game.prototype.raiseDifficulty = function () {
	  difficulty = {
	    gap: Util.fairRandom(0.23 * canvas.width, 0.23 * canvas.width),
	    gapLocation: Util.fairRandom(canvas.width),
	    dy: 0.7,
	    height: Util.fairRandom(40, 40),
	    color: Util.colors[colorsIdx % colorsLength],
	    m: 7
	  };
	};
	
	Game.prototype.sustainDifficulty = function () {
	  difficulty = {
	    gap: Util.fairRandom(0.15 * canvas.width, 70),
	    gapLocation: Util.fairRandom(canvas.width),
	    dy: 4,
	    height: Util.fairRandom(150, 100),
	    color: Util.colors[colorsIdx % colorsLength],
	    m: 20
	  };
	};
	
	Game.prototype.removeObstacle = function () {
	  var target = this.obstacles[0].inFrame() ? undefined : 0;
	  if (target === 0) {
	    this.obstacles.splice(target, 1);
	  }
	};
	
	Game.prototype.drawScore = function () {
	  // ctx.font = "lighter 23px sans-serif";
	  ctx.font = "small-caps bold 20px arial";
	  ctx.fillStyle = "white";
	  ctx.fillText("Score: " + this.score, 50, 50);
	};
	
	Game.prototype.tickScore = function () {
	  this.score += 1;
	};
	
	Game.prototype.gameOver = function () {
	  var _this = this;
	
	  canvas.style.cursor = 'default';
	  this.status = 'gameOver';
	  clearInterval(interval1);
	  clearInterval(interval2);
	  clearInterval(interval3);
	  // ctx.clearRect(0, 0, canvas.width, canvas.height);
	  this.scoreBlocks = new MenuBlocks(13, 20);
	  Util.sleep(450).then(function () {
	    scoreInterval = setInterval(_this.drawScoreBlocks.bind(_this), 2);
	  });
	};
	
	Game.prototype.checkRetry = function (e) {
	  var xRetry = this.cursor.x <= canvas.width && this.cursor.x >= 0;
	  var yRetry = this.cursor.y <= canvas.height && this.cursor.y >= 0;
	  if (xRetry && yRetry) {
	    canvas.removeEventListener("click", retryCallback);
	    this.blackBlocks = new MenuBlocks(13, 10, true);
	    this.cursor = new Cursor(x, y, ballRadius, 40);
	    this.score = 0;
	    this.obstacles = [];
	    blackInterval = setInterval(this.drawBlackBlocks.bind(this), 2);
	  }
	};
	Game.prototype.checkMenu = function (e) {
	  var xFrame = this.cursor.x <= canvas.width && this.cursor.x >= 0;
	  var yFrame = this.cursor.y <= canvas.height && this.cursor.y >= 0;
	  if (xFrame && yFrame) {
	    canvas.removeEventListener("click", menuCallback);
	    this.score = 0;
	    this.obstacles = [];
	    blackInterval = setInterval(this.drawBlackBlocks.bind(this), 2);
	  }
	};
	
	Game.prototype.renderResult = function () {
	  this.scoreLogo(150, 150);
	  ctx.font = "70px serif";
	  ctx.fillStyle = "white";
	  ctx.fillText(this.score, 580, 220);
	  this.retryLogo();
	};
	
	Game.prototype.drawMenuBlocks = function () {
	  this.menuBlocks.draw();
	  if (this.menuBlocks.done) {
	    clearInterval(menuInterval);
	    menuCallback = this.checkMenu.bind(this);
	    canvas.addEventListener("click", menuCallback);
	    this.logo();
	    this.startButton();
	  }
	};
	
	Game.prototype.drawBlackBlocks = function () {
	  this.blackBlocks.draw();
	  if (this.blackBlocks.done) {
	    clearInterval(blackInterval);
	    this.start();
	  }
	};
	
	Game.prototype.drawScoreBlocks = function () {
	  this.scoreBlocks.draw();
	  if (this.scoreBlocks.done) {
	    clearInterval(scoreInterval);
	    this.renderResult();
	    retryCallback = this.checkRetry.bind(this);
	    canvas.addEventListener("click", retryCallback);
	  }
	};
	
	Game.prototype.renderMenu = function () {
	  menuInterval = setInterval(this.drawMenuBlocks.bind(this), 2);
	  // if (this.menuBlocks.done) {
	  //
	  // }
	  // ctx.font = "Bold 70px San Serif";
	  // ctx.fillStyle = "white";
	  // ctx.font = "30px Arial";
	  // ctx.fillText("How to play: ", 250, 220);
	  // ctx.font = "25px Arial";
	  // ctx.fillText("1: keep your cursor in the frame", 260, 260);
	  // ctx.fillText("2: Avoid the falling bars", 260, 300);
	};
	
	Game.prototype.logo = function () {
	  var logo = new Image();
	  logo.src = './assets/images/logo.png';
	  logo.onload = function () {
	    ctx.drawImage(logo, 110, 100);
	  };
	};
	
	Game.prototype.scoreLogo = function (x, y) {
	  var logo = new Image();
	  logo.src = './assets/images/score.png';
	  logo.onload = function () {
	    ctx.drawImage(logo, x, y);
	  };
	};
	
	Game.prototype.startButton = function () {
	  var logo = new Image();
	  logo.src = './assets/images/start.png';
	  logo.onload = function () {
	    ctx.drawImage(logo, 300, 350);
	  };
	};
	Game.prototype.lostLogo = function () {
	  var logo = new Image();
	  logo.src = './assets/images/lost.png';
	  logo.onload = function () {
	    ctx.drawImage(logo, 180, 100);
	  };
	};
	Game.prototype.retryLogo = function () {
	  var logo = new Image();
	  logo.src = './assets/images/retry.png';
	  logo.onload = function () {
	    ctx.drawImage(logo, 330, 350);
	  };
	};
	
	Game.prototype.inProgress = function () {
	  var _this2 = this;
	
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	  this.obstacles.forEach(function (obs) {
	    obs.draw();
	  });
	  this.cursor.draw();
	
	  // check for lose conditions
	  if (this.cursor.outOfFrame()) {
	    this.gameOver();
	  }
	  this.obstacles.forEach(function (obs) {
	    if (obs.detectCollision(_this2.cursor)) {
	      _this2.gameOver();
	    }
	  });
	
	  // draw score last to maintain score on top
	  this.drawScore();
	};
	
	Game.prototype.start = function () {
	  canvas.style.cursor = 'none';
	  this.status = 'inProgress';
	  interval1 = setInterval(this.generateObstacle.bind(this), 700);
	  interval2 = setInterval(this.inProgress.bind(this), 2);
	  interval3 = setInterval(this.tickScore.bind(this), 100);
	};
	
	var game = new Game();
	game.renderMenu();
	// game.start();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Util = __webpack_require__(2);
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var rect = canvas.getBoundingClientRect();
	
	function Cursor(x, y, r, maxCursors) {
	  this.x = x;
	  this.y = y;
	  this.r = r;
	  this.maxCursors = maxCursors;
	  this.positions = [];
	  document.addEventListener("mousemove", this.mouseMoveHandler.bind(this), false);
	}
	
	Cursor.prototype.mouseMoveHandler = function (e) {
	  var pos = Util.getMousePos(rect, e);
	  this.x = pos.x;
	  this.y = pos.y;
	  // console.log(`${this.x}, ${this.y}`);
	};
	
	Cursor.prototype.draw = function () {
	  for (var i = 0; i < this.positions.length; i++) {
	    var ratio = (i + 1) / this.positions.length;
	    ctx.beginPath();
	    ctx.arc(this.positions[i].x, this.positions[i].y, ratio * this.r, 0, Math.PI * 2);
	    ctx.fillStyle = "rgba(181,18,18, " + 1 + ")";
	    // ctx.fillStyle = Util.getRndColor(ratio/2);
	    ctx.fill();
	  }
	  ctx.beginPath();
	  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
	  ctx.fillStyle = "rgb(181,18,18)";
	  ctx.fill();
	  ctx.closePath();
	  // ctx.lineWidth = this.r/2;
	  // ctx.strokeStyle = "#8000FF";
	  // ctx.stroke();
	  this.storeLastPosition(this.x, this.y);
	};
	
	Cursor.prototype.outOfFrame = function () {
	  var xInFrame = this.x <= canvas.width && this.x >= 0;
	  var yInFrame = this.y <= canvas.height && this.y >= 0;
	
	  if (xInFrame === false || yInFrame === false) {
	    return true;
	  }
	  return false;
	};
	
	Cursor.prototype.storeLastPosition = function (x, y) {
	  this.positions.push({ x: x, y: y });
	  if (this.positions.length > this.maxCursors) {
	    this.positions.shift();
	  }
	};
	
	module.exports = Cursor;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var Util = {
	  getMousePos: function getMousePos(rect, e) {
	    return {
	      x: e.clientX - rect.left,
	      y: e.clientY - rect.top
	    };
	  },
	  sleep: function sleep(time) {
	    return new Promise(function (resolve) {
	      return setTimeout(resolve, time);
	    });
	  },
	  fairRandom: function fairRandom(max, min) {
	    var randomized = Math.random() * max;
	    if (randomized < min) {
	      randomized = min;
	    }
	    return randomized;
	  },
	  RectCircleColliding: function RectCircleColliding(circle, rect) {
	    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
	    var distY = Math.abs(circle.y - rect.y - rect.h / 2);
	
	    if (distX > rect.w / 2 + circle.r) {
	      return false;
	    }
	    if (distY > rect.h / 2 + circle.r) {
	      return false;
	    }
	
	    if (distX <= rect.w / 2) {
	      return true;
	    }
	    if (distY <= rect.h / 2) {
	      return true;
	    }
	
	    var dx = distX - rect.w / 2;
	    var dy = distY - rect.h / 2;
	    return dx * dx + dy * dy <= circle.r * circle.r;
	  },
	  getRndColor: function getRndColor(transparent) {
	    var r = Math.floor(Math.random() * 255);
	    var g = Math.floor(Math.random() * 255);
	    var b = Math.floor(Math.random() * 255);
	    return 'rgba(' + r + ',' + g + ',' + b + ',' + transparent + ')';
	  },
	
	
	  colors: ["#64cac7", "#68babd", "#6daab2", "#719aa8", "#758a9d", "#797a93", "#7e6a88", "#825a7e", "#864a74", "#8a3a69", "#8e2a5f", "#931a54", "#970a4a", "#931a54", "#8e2a5f", "#8a3a69", "#864a74", "#825a7e", "#7e6a88", "#797a93", "#758a9d", "#719aa8", "#6daab2", "#68babd"]
	
	};
	
	module.exports = Util;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Block = __webpack_require__(4);
	var Util = __webpack_require__(2);
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	
	var blockLeftCenter = void 0;
	var blockRightCenter = void 0;
	
	function Obstacle(gap, gapLocation, dy, height, color, m, y) {
	  this.gap = gap;
	  this.y = y ? y : 0;
	  this.gapLocation = gapLocation + gap > canvas.width ? canvas.width - gap : gapLocation;
	
	  if (this.gapLocation === 0) {
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
	    this.blockLeft = new Block(blockLeftCenter, dy, this.gapLocation, height, color, m, this.y);
	  }
	
	  if (blockRightCenter || blockRightCenter === 0) {
	    this.blockRight = new Block(
	    // blockRightCenter, dy, canvas.width - blockRightCenter, height
	    canvas.width, dy, canvas.width - blockRightCenter, height, color, m, this.y, blockRightCenter);
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
	  var inFrameLeft = this.blockLeft.inFrame;
	  var inFrameRight = this.blockRight.inFrame;
	  if (inFrameRight === false || inFrameLeft === false) {
	    return false;
	  }
	  return true;
	};
	
	Obstacle.prototype.detectCollision = function (cursor) {
	  var leftDetection = Util.RectCircleColliding(cursor, this.blockLeft);
	  var rightDetection = Util.RectCircleColliding(cursor, this.blockRight);
	  if (leftDetection || rightDetection) {
	    return true;
	  }
	  return false;
	};
	
	module.exports = Obstacle;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var rect = canvas.getBoundingClientRect();
	function Block(x, dy, w, h, color, m, y, tx) {
	  // tx is target x
	  // m is dx multiplier
	  this.x = x;
	  this.y = y;
	  this.dy = dy;
	  this.w = w;
	  this.h = h;
	  this.tx = tx;
	  this.dx = w / canvas.width * m;
	  this.color = color;
	  this.inFrame = true;
	}
	
	Block.prototype.draw = function () {
	  ctx.beginPath();
	  if (this.x < 0) {
	    ctx.rect(this.x, this.y, this.w, this.h);
	    ctx.fillStyle = this.color;
	
	    ctx.fill();
	    ctx.closePath();
	    this.x += this.dx;
	    if (this.x > 0) {
	      this.x = 0;
	    }
	  } else if (this.tx && this.x > this.tx) {
	    ctx.rect(this.x, this.y, this.w, this.h);
	    ctx.fillStyle = this.color;
	    ctx.fill();
	    ctx.closePath();
	    this.x -= this.dx;
	    if (this.x < this.tx) {
	      this.x = this.tx;
	    }
	  } else {
	    ctx.rect(this.x, this.y, this.w, this.h);
	    ctx.fillStyle = this.color;
	    // ctx.fillStyle = "#00FFFF";
	    ctx.fill();
	    ctx.closePath();
	    this.y += this.dy;
	    if (this.y === canvas.height) {
	      this.inFrame = false;
	    }
	  }
	};
	
	module.exports = Block;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var rect = canvas.getBoundingClientRect();
	var Obstacle = __webpack_require__(3);
	var Util = __webpack_require__(2);
	
	var colorsLength = Util.colors.length;
	var colorsIdx = Math.floor(Math.random() * (colorsLength - 1));
	
	function MenuBlocks(num, speed, black) {
	  this.yCoord = 0;
	  this.height = canvas.height / num;
	  this.color = Util.colors[colorsIdx % colorsLength];
	  this.obstacles = [];
	  if (black === true) {
	    this.color = "#111111";
	  }
	  for (var i = 0; i < num; i++) {
	    this.obstacles.push(new Obstacle(0, Util.fairRandom(canvas.width), 0, this.height, this.color, speed, this.yCoord));
	    if (black === undefined) {
	      colorsIdx += 1;
	      this.color = Util.colors[colorsIdx % colorsLength];
	    }
	    this.yCoord += this.height;
	  }
	  this.done = false;
	}
	
	MenuBlocks.prototype.draw = function () {
	  var _this = this;
	
	  if (this.done === false) {
	    this.obstacles.forEach(function (obs) {
	      obs.draw();
	    });
	    if (this.obstacles[this.obstacles.length - 1].blockLeft.x === 0) {
	      Util.sleep(50).then(function () {
	        _this.done = true;
	      });
	    }
	  }
	};
	
	// Usage!
	
	
	module.exports = MenuBlocks;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map