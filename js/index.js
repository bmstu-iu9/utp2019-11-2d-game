'use strict';

import {gameManager} from './gameManager.js';

export let canvas = document.getElementById("canvasid");//находим canvas по id
export let ctx = canvas.getContext("2d"); //включаем 2d графику

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gameManager.loadAll();

gameManager.play();