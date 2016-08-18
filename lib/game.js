const Cursor = require('./cursor.js');

let canvas = document.getElementById("myCanvas");
let x = canvas.width/2;
let y = canvas.height/2;
let ballRadius = 5;


function Game () {

}


const testCursor = new Cursor(x, y, ballRadius);
testCursor.place();
