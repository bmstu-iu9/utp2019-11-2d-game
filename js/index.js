'use strict';

import {gameManager} from './gameManager.js';

export let canvas = document.getElementById("canvasid");//находим canvas по id
export let ctx = canvas.getContext("2d"); //включаем 2d графику
export let div = document.createElement('div');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audio = new Audio('music/music.mp3');

audio.canplay = () => {
    console.log("я готова");
}

audio.abort = () => {
    console.log("я не готова");
}

audio.progress = () => {
    console.log("Начинаю");
}

console.log(audio.canPlayType('audio/mpeg'));

gameManager.loadAll();
//gameManager.playAudio();
gameManager.play();