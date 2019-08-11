var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var bg = new Image();
var needle = new Image();
var wedge = new Image();
var center = new Image();

//IMAGE SIZES
var canvasSize = 800;
var shipWidth = 25, shipHeight = 25;
var centerWidth = 25, centerHeight = 25;

//sources
bg.src = "img/bg.png";
needle.src = "img/needle.png";
wedge.src = "img/wedge.png";
center.src = "img/center.png";

var rotationAngle = Math.PI/50;

document.addEventListener("keydown", move);

function move(e) {
    switch(e.keyCode){
        //wedge
        case 65: // KeyA - left
            ctx.clearRect(0,0,canvasSize,canvasSize);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(wX + shipWidth/2,wY+shipHeight/2);
            ctx.rotate(wA-rotationAngle);
            wA -= rotationAngle;
            while (wA < 0) wA += 2*Math.PI;
            ctx.translate(- wX - shipWidth/2,-wY-shipHeight/2);
            ctx.drawImage(wedge, wX,wY);
            ctx.restore();
            ctx.save();
            ctx.translate(nX + shipWidth/2, nY + shipHeight/2);
            ctx.rotate(nA);
            ctx.translate(-nX - shipWidth/2, -nY - shipHeight/2);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.drawImage(center, cX,cY);
            break;
        case 68: // KeyD - right
            ctx.clearRect(0,0,canvasSize,canvasSize);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(wX + shipWidth/2,wY + shipHeight/2);
            ctx.rotate(wA+rotationAngle);
            wA += rotationAngle;
            while (wA > 2*Math.PI) wA -= 2*Math.PI;
            ctx.translate(- wX - shipWidth/2,-wY-shipHeight/2);
            ctx.drawImage(wedge, wX, wY);
            ctx.restore();
            ctx.save();
            ctx.translate(nX + shipWidth/2, nY + shipHeight/2);
            ctx.rotate(nA);
            ctx.translate(-nX - shipWidth/2, -nY - shipHeight/2);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.drawImage(center, cX, cY);
            break;
        case 87: // KeyW - bang
            break;
        case 83: // KeyS - nitro
            break;
        //needle
        case 74: // KeyJ - left
            ctx.clearRect(0,0,canvasSize,canvasSize);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(nX + shipWidth/2, nY + shipHeight/2);
            ctx.rotate(nA - rotationAngle);
            nA -= rotationAngle;
            while (nA < 0) nA += 2*Math.PI;
            ctx.translate(-nX - shipWidth/2, -nY - shipHeight/2);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.save();
            ctx.translate(wX + shipWidth/2,wY + shipHeight/2);
            ctx.rotate(wA);
            ctx.translate(- wX - shipWidth/2,-wY-shipHeight/2);
            ctx.drawImage(wedge, wX, wY);
            ctx.restore();
            ctx.drawImage(center, cX,cY);
            break;
        case 76: // KeyL - right
            ctx.clearRect(0,0,canvasSize,canvasSize);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(nX + shipWidth/2, nY + shipHeight/2);
            ctx.rotate(nA + rotationAngle);
            nA += rotationAngle;
            while (nA > 2*Math.PI) nA -= 2*Math.PI;
            ctx.translate(-nX - shipWidth/2, -nY - shipHeight/2);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.save();
            ctx.translate(wX + shipWidth/2,wY + shipHeight/2);
            ctx.rotate(wA);
            ctx.translate(- wX - shipWidth/2,-wY-shipHeight/2);
            ctx.drawImage(wedge, wX, wY);
            ctx.restore();
            ctx.drawImage(center, cX,cY);
            break;
        case 73: // KeyI - bang
            break;
        case 75: // KeyK - nitro
            break;
    }
}



var wX = 10, wY = 10, wA = 0;
var nX = canvasSize - shipWidth - wX, nY = canvasSize - shipHeight - wY, nA = 0;
var cX = canvasSize/2 - centerHeight/2, cY = canvasSize/2 - centerWidth/2;
//var gravity = 0.5;
function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.save();
  ctx.translate(wX + shipWidth/2,wY+shipHeight/2);
  ctx.rotate(Math.PI);
  wA = Math.PI;
  ctx.translate(- wX - shipWidth/2,-wY-shipHeight/2);
  ctx.drawImage(wedge, wX,wY);
  ctx.restore();
  ctx.drawImage(needle, nX, nY);
  ctx.drawImage(center, cX,cY);
  //nX+=gravity;
  //nY+=gravity;
  //requestAnimationFrame(draw);
}

center.onload = draw;
