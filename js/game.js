var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var bg = new Image();
var needle = new Image();
var wedge = new Image();
var center = new Image();
var size = 800;

bg.src = "img/bg.png";
needle.src = "img/needle.png";
wedge.src = "img/wedge.png";
center.src = "img/center.png";

document.addEventListener("keydown", move);
function move(e) {
    switch(e.keyCode){
        //wedge
        case 65: // KeyA - left
            ctx.clearRect(0,0,800,800);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(22,22);
            ctx.rotate(wA-Math.PI/10);
            wA-=Math.PI/10;
            ctx.translate(-22,-22);
            ctx.drawImage(wedge, wX,wY);
            ctx.restore();
            ctx.save();
            ctx.translate(778,778);
            ctx.rotate(nA);
            ctx.translate(-778,-778);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.drawImage(center, cX,cY);
            break;
        case 68: // KeyD - right
            ctx.clearRect(0,0,800,800);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(22,22);
            ctx.rotate(wA+Math.PI/10);
            wA+=Math.PI/10;
            ctx.translate(-22,-22);
            ctx.drawImage(wedge, wX,wY);
            ctx.restore();
            ctx.save();
            ctx.translate(778,778);
            ctx.rotate(nA);
            ctx.translate(-778,-778);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.drawImage(center, cX,cY);
            break;
        case 87: // KeyW - bang
            break;
        case 83: // KeyS - nitro
            break;
        //needle
        case 74: // KeyJ - left
            ctx.clearRect(0,0,800,800);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(778,778);
            ctx.rotate(nA-Math.PI/10);
            nA-=Math.PI/10;
            ctx.translate(-778,-778);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.save();
            ctx.translate(22,22);
            ctx.rotate(wA);
            ctx.translate(-22,-22);
            ctx.drawImage(wedge, wX, wY);
            ctx.restore();
            ctx.drawImage(center, cX,cY);
            break;
        case 76: // KeyL - right
            ctx.clearRect(0,0,800,800);
            ctx.drawImage(bg, 0, 0);
            ctx.save();
            ctx.translate(778,778);
            ctx.rotate(nA+Math.PI/10);
            nA+=Math.PI/10;
            ctx.translate(-778,-778);
            ctx.drawImage(needle, nX, nY);
            ctx.restore();
            ctx.save();
            ctx.translate(22,22);
            ctx.rotate(wA);
            ctx.translate(-22,-22);
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
var nX = 765, nY = 765, nA = 0;
var cX = 392, cY = 392;
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
