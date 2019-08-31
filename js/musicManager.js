'use strict';

import {AABB} from './AABB.js';
import {drawManager} from './drawManager.js';
import {physicManager} from './physicManager.js';
import {Vector2} from './Vector2.js';
import {spriteManager} from './spriteManager.js';
import {mapManager} from './mapManager.js';

export let musicManager = {
    background(){
        let vid = document.getElementById("background");
        vid.volume = 0.1;
        vid.onended = vid.play();
    }
};