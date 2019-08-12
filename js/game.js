var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var bg = new Image();
var needle = new Image();
var wedge = new Image();
var center = new Image();

//IMAGE SIZES
var canvasSize = 800;
var shipWidth =  50, shipHeight = 28;
var centerWidth = 25, centerHeight = 25;

//sources
bg.src = "img/bg.png";
needle.src = "img/needle.png";
wedge.src = "img/wedge.png";
center.src = "img/center.png";

var rotationAngle = Math.PI/50;

document.addEventListener("keydown", move);

function move(e) {

    //alert(e.keyCode);
    switch(e.keyCode){
        //wedge
        case 65: // KeyA - left
            wA -= rotationAngle;
            while (wA < 0) wA += 2*Math.PI;
            break;
        case 68: // KeyD - right
            wA += rotationAngle;
            while (wA > 2*Math.PI) wA -= 2*Math.PI;
            break;
        case 87: // KeyW - bang
            break;
        case 83: // KeyS - nitro
            if (0 <= wA && wA <= Math.PI) {
              wY += Math.abs(Math.tan(wA)*Math.sqrt(10/(1+Math.tan(wA)*Math.tan(wA))));
            } else {
              wY -= Math.abs(Math.tan(wA)*Math.sqrt(10/(1+Math.tan(wA)*Math.tan(wA))));
            }
            if (Math.PI/2 <= wA && wA <=3*Math.PI/2) {
              wX -= Math.sqrt(10/(1+Math.tan(wA)*Math.tan(wA)));
            } else {
              wX += Math.sqrt(10/(1+Math.tan(wA)*Math.tan(wA)));
            }
            break;
        //needle
        case 74: // KeyJ - left
            nA -= rotationAngle;
            while (nA < 0) nA += 2*Math.PI;
            break;
        case 76: // KeyL - right
            nA += rotationAngle;
            while (nA > 2*Math.PI) nA -= 2*Math.PI;
            break;
        case 73: // KeyI - bang
            break;
        case 75: // KeyK - nitro
            if (0 <= nA && nA <= Math.PI) {
              nY += Math.abs(Math.tan(nA)*Math.sqrt(10/(1+Math.tan(nA)*Math.tan(nA))));
            } else {
              nY -= Math.abs(Math.tan(nA)*Math.sqrt(10/(1+Math.tan(nA)*Math.tan(nA))));
            }
            if (Math.PI/2 <= nA && nA <= 3*Math.PI/2) {
              nX -= Math.sqrt(10/(1+Math.tan(nA)*Math.tan(nA)));
            } else {
              nX += Math.sqrt(10/(1+Math.tan(nA)*Math.tan(nA)));
            }
            break;
    }
}
var wX = 40, wY = 40, wA = Math.PI/2; // Х, У и угол наклона Wedge
var nX = canvasSize - shipWidth - wX, nY = canvasSize - shipHeight - wY, nA = 3*Math.PI/2; // Х, У и угол наклона Needle
var cX = canvasSize/2 - centerWidth/2 , cY = canvasSize/2 - centerWidth/2; //X, Y центра
var dif = 0.001; //расстояние от корабля до центра
var gravity =  40000; //от гравитации зависит ускорение при приближении к центру,  чем больше - тем быстрее

function gravityStep(){
  dif =(wX - cX) * (wX - cX) + (wY - cY) * (wY - cY);
  if (Math.abs(cX - wX) < centerWidth/2 && Math.abs(cY - wY) < centerHeight/2 ) {
    alert("Wedge died =(");
    location.reload();
  }
  if (cX > wX) {
    wX += (gravity/dif);
  } else {
    if (cX != wX) {
      wX-=(gravity/dif);
    }
  }
  if (cY > wY) {
    wY += (gravity/dif);
  } else {
    if (cY != wY){
    wY -= (gravity/dif);
    }
  }

  dif = (nX - cX) * (nX - cX) + (nY - cY) * (nY - cY);
  if (Math.abs(cX - nX) < centerWidth/2 && Math.abs(cY - nY) < centerHeight/2 ) {
    alert("Needle died =(");
    location.reload();
  }
  if (cX > nX) {
    nX += (gravity/dif);
  } else {
    if (cX != nX) {
    nX -= (gravity/dif);
    }
  }
  if (cY > nY) {
    nY += (gravity/dif);
  } else {
    if (cY != nY){
    nY -= (gravity/dif);
  }
  }

}


function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.save();
  ctx.translate(wX + shipWidth/2,wY+shipHeight/2);
  ctx.rotate(wA);
  ctx.translate(- wX - shipWidth/2,-wY-shipHeight/2);
  ctx.drawImage(wedge, wX,wY);
  ctx.restore();
  ctx.save();
  ctx.translate(nX + shipWidth/2,nY+shipHeight/2);
  ctx.rotate(nA);
  ctx.translate(- nX - shipWidth/2,-nY-shipHeight/2);
  ctx.drawImage(needle, nX,nY);
  ctx.restore();
  ctx.drawImage(center, cX,cY);
  gravityStep();
  requestAnimationFrame(draw);

}

center.onload = draw;
