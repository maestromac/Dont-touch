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
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	var ballRadius = 5;
	
	var interval1 = void 0;
	var interval2 = void 0;
	var interval3 = void 0;
	
	var mouseClickListener = void 0;
	var listenerCount = 0;
	var retryCallback = void 0;
	var menuCallback = void 0;
	
	function Game() {
	  this.cursor = new Cursor(x, y, ballRadius);
	  this.score = 0;
	  this.status = "intro";
	  this.obstacles = [];
	}
	
	Game.prototype.generateObstacle = function () {
	  this.obstacles.push(new Obstacle(Util.fairRandom(0.2 * canvas.width, 70), Util.fairRandom(canvas.width), 1, Util.fairRandom(200, 50)));
	  this.removeObstacle();
	};
	
	Game.prototype.removeObstacle = function () {
	  var target = this.obstacles[0].inFrame() ? undefined : 0;
	
	  if (target === 0) {
	    this.obstacles.splice(target, 1);
	  }
	};
	
	Game.prototype.drawScore = function () {
	  ctx.font = "23px Arial";
	  ctx.fillStyle = "#000000";
	  ctx.fillText("Score: " + this.score, 50, 50);
	};
	
	Game.prototype.tickScore = function () {
	  this.score += 1;
	};
	
	Game.prototype.gameOver = function () {
	  canvas.style.cursor = 'default';
	  this.status = 'gameOver';
	  clearInterval(interval1);
	  clearInterval(interval2);
	  clearInterval(interval3);
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  this.renderResult();
	
	  retryCallback = this.checkRetry.bind(this);
	  canvas.addEventListener("click", retryCallback);
	};
	
	Game.prototype.checkRetry = function (e) {
	  var xRetry = this.cursor.x <= 500 && this.cursor.x >= 310;
	  var yRetry = this.cursor.y <= 435 && this.cursor.y >= 400;
	  if (xRetry && yRetry) {
	    canvas.removeEventListener("click", retryCallback);
	    this.score = 0;
	    this.obstacles = [];
	    this.start();
	  }
	};
	Game.prototype.checkMenu = function (e) {
	  var xRetry = this.cursor.x <= 500 && this.cursor.x >= 310;
	  var yRetry = this.cursor.y <= 435 && this.cursor.y >= 400;
	  if (xRetry && yRetry) {
	    canvas.removeEventListener("click", menuCallback);
	    this.score = 0;
	    this.obstacles = [];
	    this.start();
	  }
	};
	
	Game.prototype.renderResult = function () {
	  ctx.font = "70px Arial";
	  ctx.fillStyle = "#000000";
	  var temp = ctx.fillText("You Lost !!", 300, 250);
	
	  ctx.font = "40px Arial";
	  ctx.fillText("You scored: " + this.score, 310, 320);
	
	  ctx.fillStyle = "#0095DD";
	  ctx.font = "40px Arial";
	
	  ctx.fillText("Play again", 310, 430);
	};
	
	Game.prototype.renderMenu = function () {
	  menuCallback = this.checkMenu.bind(this);
	  canvas.addEventListener("click", menuCallback);
	  ctx.font = "70px Arial";
	  ctx.fillStyle = "#000000";
	  var temp = ctx.fillText("Don't Touch!!", 250, 150);
	
	  ctx.font = "30px Arial";
	  ctx.fillText("How to play: ", 250, 220);
	  ctx.font = "25px Arial";
	  ctx.fillText("1: keep your cursor in the frame", 260, 260);
	  ctx.fillText("2: Avoid the falling bars", 260, 300);
	
	  ctx.fillStyle = "#0095DD";
	  ctx.font = "50px Arial";
	
	  ctx.fillText("Start!", 310, 430);
	};
	
	Game.prototype.inProgress = function () {
	  var _this = this;
	
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	  this.obstacles.forEach(function (obs) {
	    obs.draw();
	  });
	  this.drawScore();
	  this.cursor.draw();
	
	  // check for lose conditions
	  if (this.cursor.outOfFrame()) {
	    this.gameOver();
	  }
	  this.obstacles.forEach(function (obs) {
	    if (obs.detectCollision(_this.cursor)) {
	      _this.gameOver();
	    }
	  });
	};
	
	Game.prototype.start = function () {
	  canvas.style.cursor = 'none';
	  this.status = 'inProgress';
	  interval1 = setInterval(this.generateObstacle.bind(this), 1000);
	  interval2 = setInterval(this.inProgress.bind(this), 2);
	  interval3 = setInterval(this.tickScore.bind(this), 100);
	};
	
	var game = new Game();
	game.renderMenu();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Util = __webpack_require__(2);
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var rect = canvas.getBoundingClientRect();
	
	function Cursor(x, y, r) {
	  this.x = x;
	  this.y = y;
	  this.r = r;
	  document.addEventListener("mousemove", this.mouseMoveHandler.bind(this), false);
	}
	
	Cursor.prototype.mouseMoveHandler = function (e) {
	  var pos = Util.getMousePos(rect, e);
	  this.x = pos.x;
	  this.y = pos.y;
	  // console.log(`${this.x}, ${this.y}`);
	};
	
	Cursor.prototype.drawBall = function () {
	  ctx.beginPath();
	  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
	  ctx.fillStyle = "#990000";
	  ctx.fill();
	  ctx.closePath();
	};
	
	Cursor.prototype.outOfFrame = function () {
	  var xInFrame = this.x <= canvas.width && this.x >= 0;
	  var yInFrame = this.y <= canvas.height && this.y >= 0;
	
	  if (xInFrame === false || yInFrame === false) {
	    return true;
	  }
	  return false;
	};
	
	Cursor.prototype.draw = function () {
	  this.drawBall();
	};
	
	module.exports = Cursor;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var Util = {
	  getMousePos: function getMousePos(rect, e) {
	    return {
	      x: e.clientX - rect.left,
	      y: e.clientY - rect.top
	    };
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
	  }
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
	
	function Obstacle(gap, gapLocation, dy, height) {
	  this.gap = gap;
	  this.gapLocation = gapLocation + gap > canvas.width ? canvas.width - gap : gapLocation;
	
	  if (this.gapLocation === 0) {
	    blockRightCenter = this.gap;
	  } else if (this.gapLocation === canvas.width) {
	    // this.gapLocation -= this.gap;
	    blockLeftCenter = 0;
	  } else {
	    blockLeftCenter = 0;
	    blockRightCenter = this.gap + this.gapLocation;
	  }
	
	  if (blockLeftCenter || blockLeftCenter === 0) {
	    this.blockLeft = new Block(blockLeftCenter, dy, this.gapLocation, height);
	  }
	
	  if (blockRightCenter || blockRightCenter === 0) {
	    this.blockRight = new Block(blockRightCenter, dy, canvas.width - blockRightCenter, height);
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
	
	function Block(x, dy, w, h) {
	  this.x = x;
	  this.y = -300;
	  this.dy = dy;
	  this.w = w;
	  this.h = h;
	  this.inFrame = true;
	}
	
	Block.prototype.draw = function () {
	  ctx.beginPath();
	  ctx.rect(this.x, this.y, this.w, this.h);
	  ctx.fillStyle = "#0095DD";
	  ctx.fill();
	  ctx.closePath();
	  this.y += this.dy;
	  if (this.y === canvas.height) {
	    this.inFrame = false;
	  }
	};
	
	module.exports = Block;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map