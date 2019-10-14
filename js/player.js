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

    createObject(x, y, speed, key, name, life, direction) {
        let newObj = Object.create(this);
        newObj.physicManager = physicManager.createObject(new Vector2(x, y, 0),
            speed,
            new AABB(new Vector2(x + this.size_x / 2, y + this.size_y / 2, 0),
                new Vector2(this.size_x / 4, this.size_y / 2, 0)),
            new AABB(new Vector2(x + this.size_x / 2, y + this.size_y / 2, 0),
                new Vector2(this.size_x / 4, this.size_y / 2, 0)),
            new Vector2(this.size_x, this.size_y, 0), key, direction);

        newObj.drawManager = Object.create(drawManager);
        newObj.drawManager.state = 'idle';
        newObj.drawManager.frame = 0;
        if (!direction) {
            newObj.drawManager.frameName = 'adventurer-idle-2-00';
        } else {
            newObj.drawManager.frameName = 'adventurer-idle-2-00-mirror';
        }
        newObj.drawManager.direction = direction;
        newObj.life = life;
        newObj.name = name;
        return newObj;
    },

    draw(ctx) { // прорисовка игрока
        spriteManager.drawSprite(ctx, this.drawManager.getSpriteName(), this.pos_x, this.pos_y);
        spriteManager.drawHitBox(ctx, this.physicManager.mAABB);
        spriteManager.drawHitBox(ctx, this.physicManager.weaponAABB)
    },

    update() { // обновление в цикле
        if (mapManager.loadLayer) {
            let state = this.physicManager.update(this.name);
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