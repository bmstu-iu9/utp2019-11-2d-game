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
            wA-=rotationAngle;
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
            wA+=rotationAngle;
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
            if (wA <= Math.PI && wA >= 0) {
                wY -= Math.sqrt(10/(1+Math.tan(wA)*Math.tan(wA)));
                alert("OYE");
            } else {
                wY += Math.sqrt(10/(1+Math.tan(wA)*Math.tan(wA)));
            }

            wX -= Math.tan(wA)*Math.sqrt(10/(1+Math.tan(wA)*Math.tan(wA)));
            ctx.clearRect(0,0,canvasSize,canvasSize);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(wX + shipWidth/2,wY + shipHeight/2);
            ctx.rotate(wA+rotationAngle);
            //wA+=rotationAngle;
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
        //needle
        case 74: // KeyJ - left
            ctx.clearRect(0,0,canvasSize,canvasSize);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(nX + shipWidth/2, nY + shipHeight/2);
            ctx.rotate(nA - rotationAngle);
            nA-=rotationAngle;
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
            nA+=rotationAngle;
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



var wX = 10, wY = 10, wA = Math.PI;
var nX = canvasSize - shipWidth - wX, nY = canvasSize - shipHeight - wY, nA = 0;
var cX = canvasSize/2 - centerHeight/2, cY = canvasSize/2 - centerWidth/2;
//var gravity = 0.5;
function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(needle, nX, nY);
  ctx.drawImage(wedge, wX, wY);
  ctx.drawImage(center, cX,cY);
  //nX+=gravity;
  //nY+=gravity;
  //requestAnimationFrame(draw);
}

center.onload = draw;
