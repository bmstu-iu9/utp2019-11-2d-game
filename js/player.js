'use strict';

import {AABB} from './AABB.js';
import {drawManager} from './drawManager.js';
import {physicManager} from './physicManager.js';
import {Vector2} from './Vector2.js';
import {spriteManager} from './spriteManager.js';
import {mapManager} from './mapManager.js';

export let Player = {
    //pos_x: 50,
    //pos_y: 60, // позиция игрока
    size_x: 50,
    size_y: 37, // размеры игрока
    //lifetime = 100; // показатели здоровья
    //move_x: 0, move_y: 0, // направление движения
    //speed: 10, // скорость объекта
    //hitBox: null,
    physicManager: null,
    drawManager: null,

    createObject(x, y, speed, key, name) {
        let newObj = Object.create(this);
        newObj.physicManager = physicManager.createObject(new Vector2(x, y),
            speed,
            new AABB(new Vector2(x + this.size_x / 2, y + this.size_y / 2),
                new Vector2(this.size_x / 2, this.size_y / 2)),
            new Vector2(this.size_x, this.size_y), key, name);
        newObj.drawManager = Object.create(drawManager);
        newObj.drawManager.state = 'idle';
        newObj.drawManager.frame = 0;
        newObj.drawManager.frameName = 'adventurer-idle-2-00';
        newObj.drawManager.direction = false;
        return newObj;
    },

    draw(ctx) { // прорисовка игрока
        spriteManager.drawSprite(ctx, this.drawManager.getSpriteName(), this.pos_x, this.pos_y);
        spriteManager.drawHitBox(ctx, this.physicManager.mAABB);
    },

    update() { // обновление в цикле
        if (mapManager.loadLayer) {
            let state = this.physicManager.update();
            this.drawManager.updateState(state);
        }
        this.pos_x = this.physicManager.mPosition.x;
        this.pos_y = this.physicManager.mPosition.y;
    },

    /*
        onTouchEntity(obj) { // обработка встречи с препядствием

        },

        kill() { // уничтожение объекта

        }

     */
};