'use strict';

import {eventsManager} from './eventsManager.js';
import {gameManager} from './gameManager.js';
import {Vector2} from './Vector2.js';
import {mapManager} from './mapManager.js';
import {canvas} from "./index.js";

//менеджер физики объектов
export let physicManager = {
    rightOfWay: [0, 862, 821, 780, 771, 812, 813, 772, 815, 774, 821, 892, 1026, 1031],
    g: 1, //ускорение свободного падения
    jumpPower: 10, //сила прыжка



    createObject(mPosition, mSpeed, mAABB, weaponAABB, mScale, key, direction) {//конструктор
        let newObj = Object.create(this);
        newObj.mOldPosition = null; //положение на предыдущем кадре
        newObj.mPosition = null; //текущее положение
        newObj.mOldSpeed = null; //скорость на предыдущем кадре
        newObj.mSpeed = null; //текущая скорость
        newObj.direction = null; //направление персонажа: лево-true/право-false
        newObj.move = null; //направление движения
        newObj.mScale = null; //масштаб
        newObj.attack = null; // состояние атаки

        newObj.stun = 0; // таймер запрета на действия

        newObj.mAABB = null; //хитбокс
        newObj.weaponAABB = null; //хитбокс оружия
        //mAABBOffset = null; //смещение хит бокса

        //стена справа
        newObj.mPushedRightWall = false; //находился ли объект близко к ней последний кадр
        newObj.mPushesRightWall = false; //объект находится ли близко к стене

        //стена слева
        newObj.mPushedLeftWall = false; //находился ли объект близко к ней последний кадр
        newObj.mPushesLeftWall = false; //объект находится ли близко к стене

        //пол
        newObj.mWasOnGround = false; //находился ли объект близко к полу последний кадр
        newObj.mOnGround = false; //объект находится ли близко к полу

        //потолок
        newObj.mWasAtCeiling = false; //находился ли объект близко к потолку последний кадр
        newObj.mAtCeiling = false; //объект находится ли близко к потолку

        newObj.attack = false;
        newObj.mPosition = mPosition;
        newObj.mSpeed = new Vector2(mSpeed, 0);
        newObj.mAABB = mAABB;
        newObj.weaponAABB = weaponAABB;
        newObj.mScale = mScale;
        newObj.move = new Vector2(0, 0);
        newObj.direction = direction;
        newObj.mOldPosition = new Vector2(0, 0);
        newObj.mOldSpeed = new Vector2(0, 0);
        newObj.key = key;
        //newObj.name = name;
        return newObj;
    },

    setMove() {
        //по умолчанию игрок никуда не двигается
        this.move.x = 0;
        this.move.y = 0;

        //поймали событие обрабатываем
        if (eventsManager.action[this.key['up']]) {
            this.move.y = 1;
            if (this.mWasOnGround) {
                this.mSpeed.y = -this.jumpPower;
            }
            //if (this.mWasOnGround) { //подумать
            //this.mOnGround = false;
            //}
        }
        if (eventsManager.action[this.key['left']]){
            this.move.x = -1;
        }
        if (eventsManager.action[this.key['right']]){
            this.move.x = 1;
        }
    },

    //методы
    update(name) {//обновление состояния объекта
        //сохраняем предыдущие значения
        this.mOldPosition.copy(this.mPosition);
        this.mOldSpeed.copy(this.mSpeed);
        this.mPushedRightWall = this.mPushesRightWall;
        this.mPushedLeftWall = this.mPushesLeftWall;
        this.mWasOnGround = this.mOnGround;
        this.mWasAtCeiling = this.mAtCeiling;
        this.oldMove = this.move;

        if (!this.attack) {
            this.setMove();
        }

        if (!this.mOnGround) {
            this.move.y = 1;
        }
        //if (this.move.x === 0 && this.move.y === 0)
        //   return 'stop'; //скорость движения нулевая

        let modX = 0;
        let modY = 0;
        if (!this.attack) {
            //вычисение новых координат объекта
            modX = Math.floor(this.move.x * this.mSpeed.x);
            modY = Math.floor(this.move.y * this.mSpeed.y);
        }

        let center = this.mAABB.center;
        let halfSize = this.mAABB.halfSize;

        //вычисляем грани хит бокса
        let up = center.y - halfSize.y + modY; //вверх
        let down = center.y + halfSize.y + modY; //низ
        let right = center.x + halfSize.x + modX; //правый угол
        let left = center.x - halfSize.x + modX; //левый угол

        //анализ пространства на карте по направлению движения
        //let tsDown = mapManager.getTilesetIdx(this.mAABB.center.x, down);
        // let tsRight = mapManager.getTilesetIdx(right, this.mAABB.center.y);
        // let tsLeft = mapManager.getTilesetIdx(left, this.mAABB.center.y);

        let tsRightUp = mapManager.getTilesetIdx(right, center.y - halfSize.y + mapManager.tSize.y);
        let tsUpRight = mapManager.getTilesetIdx(center.x + halfSize.x - mapManager.tSize.x, up);
        let tsUpLeft = mapManager.getTilesetIdx(center.x - halfSize.x + mapManager.tSize.x, up);
        let tsLeftUp = mapManager.getTilesetIdx(left, center.y - halfSize.y + mapManager.tSize.y);
        let tsLeftDown = mapManager.getTilesetIdx(left, center.y + halfSize.y - mapManager.tSize.y);
        let tsDownLeft = mapManager.getTilesetIdx(center.x - halfSize.x + mapManager.tSize.x, down);
        let tsDownRight = mapManager.getTilesetIdx(center.x + halfSize.x - mapManager.tSize.x, down);
        let tsRightDown = mapManager.getTilesetIdx(right, halfSize.y + center.y - mapManager.tSize.y);

        //let e = this.entityAtXY(obj, newX, newY); //объект на пути
        /*
        if (e !== null && obj.onTouchEntity) //если есть конфликт (onTouchEnity - функция встречи с другим объектом)
            obj.onTouchEntity(e); //разбор конфликта внутри объекта
        if (ts !== 7 && obj.onTouchMap) //есть припятствие (onTou
            obj.onTouchMap(ts); //разбор конфликта с припятствием внутри объекта

        if (ts === 7 && e === null){ //перемещаем объект на свободное место
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return "break"; //дальше двигаться нельзя
        }
        */

        //console.log(tsDownLeft, tsDownRight);
        if (!this.find(this.rightOfWay, tsDownLeft) || !this.find(this.rightOfWay, tsDownRight)) {
            if (!this.mWasOnGround) //подумать
                modY = mapManager.tSize.y - ((this.mAABB.center.y + this.mAABB.halfSize.y) % mapManager.tSize.y);
            else
                modY = 0;
            this.mSpeed.y = 0;//-this.jumpPower;
            this.mOnGround = true;
        } else {
            this.mSpeed.y += this.g;
            this.mOnGround = false;
        }

        //console.log(tsLeftDown, tsLeftUp);
        if (!this.find(this.rightOfWay, tsRightDown) || !this.find(this.rightOfWay, tsRightUp) || right > canvas.width) {
            if (!this.mPushedRightWall && (this.mAABB.center.x - this.mAABB.halfSize.x) !== canvas.width){
                modX = mapManager.tSize.x - ((this.mAABB.center.x + this.mAABB.halfSize.x) % mapManager.tSize.x);
            } else
                modX = 0;
            this.mPushesRightWall = true;
        } else {
            this.mPushesRightWall = false;
        }

        //console.log(left);
        if (!this.find(this.rightOfWay, tsLeftDown) || !this.find(this.rightOfWay, tsLeftUp) || left < 0) {
            //console.log(!this.mPushedLeftWall, (this.mAABB.center.x - this.mAABB.halfSize.x));
            if (!this.mPushedLeftWall && (this.mAABB.center.x - this.mAABB.halfSize.x) !== 0){
                modX = -((this.mAABB.center.x - this.mAABB.halfSize.x) % mapManager.tSize.x);
            } else
                modX = 0;
            this.mPushesLeftWall = true;
        } else {
            this.mPushesLeftWall = false;
        }

        //console.log(tsUpLeft, tsUpRight);
        if (!this.find(this.rightOfWay, tsUpLeft) || !this.find(this.rightOfWay, tsUpRight)){
            if (!this.mWasAtCeiling){
                modY = -((center.y - halfSize.y) % mapManager.tSize.y);
            } else
                modY = 0;
            this.mSpeed.y = 0;
            this.mAtCeiling = true;
        } else {
            this.mAtCeiling = false;
        }

        this.mPosition.x += modX;
        this.mPosition.y += modY;

        this.mAABB.center.x += modX;
        this.mAABB.center.y += modY;
        this.weaponAABB.x += modX;
        this.weaponAABB.y += modY;

        if (modX > 0) {
            this.direction = false;
        } else if (modX < 0) {
            this.direction = true;
        }

        if ((eventsManager.action[this.key['attack']] || this.attack) && this.mOnGround){
            this.stun++;
            if (this.stun === 1) {
                this.attack = true;
                if (!this.direction) {
                    this.weaponAABB.center += 37;
                } else {
                    this.weaponAABB.center -= 37;
                }
            }
            if (this.stun === 5) {
                this.stun = 0;
                this.attack = false;
                this.weaponAABB.center = this.mAABB.center;
            } else {
                this.entityAtXY(name);
                eventsManager.action[this.key['attack']] = false;
                return "attack";
            }
        } else if (modX === 0 && modY === 0){
            return "idle";
        } else if (modY < 0 && modX > 0){
            return "jumpRight";
            //прыжок вправо
        } else if (modY < 0 && modX < 0){
            return "jumpLeft";
            //прыжок влево
        } else if (modY < 0 && modX === 0){
            return "jump";
            //прыжок
        } else if (modY > 0 && modX > 0){
            return "fallRight";
            //падение вправо
        } else if (modY > 0 && modX < 0){
            return "fallLeft";
            //падение влево
        } else if (modY > 0 && modX === 0){
            return "fall";
            //падение
        } else if (modY === 0 && modX > 0){
            return "runRight";
            //бег вправо
        } else if (modY === 0 && modX < 0){
            return "runLeft";
            //бег влево
        }
    },

    find(array, elem) {
        for (let i = 0; i < array.length; i++)
            if (array[i] === elem)
                return true;
        return false;
    },

    entityAtXY(name) {//определение столкновения объекта по заданным координатам
        for (let i = 0; i < gameManager.entities.length; i++) {
            let e = gameManager.entities[i]; //все объекты карты
            //console.log(e.physicManager.name);
            if (e.name !== name && this.weaponAABB.overlaps(e.physicManager.mAABB)) {
                e.life--;
                //console.log(name);
                //console.log(e.name, e.life);
            }
        }
    }
};
