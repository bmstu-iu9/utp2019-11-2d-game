'use strict';

import {eventsManager} from './eventsManager.js';
import {gameManager} from './gameManager.js';
import {Vector2} from './Vector2.js';
import {mapManager} from './mapManager.js';
import {canvas} from "./index.js";

//менеджер физики объектов
export let physicManager = {
    rightOfWay: [0, 862, 821, 780],
    move: null, //направление движения
    g: 1, //ускорение свободного падения
    powerJump: 10, //сила прыжка

    mOldPosition: null, //положение на предыдущем кадре
    mPosition: null, //текущее положение

    mOldSpeed: null, //скорость предыдущем кадре
    mSpeed: null, //текущая скорость

    mScale: null, //масштаб

    mAABB: null, //хит бокс
    //mAABBOffset = null; //смещение хит бокса

    //стена справа
    mPushedRightWall: false, //находился ли объект близко к ней последний кадр
    mPushesRightWall: false, //объект находится ли близко к стене

    //стена слева
    mPushedLeftWall: false, //находился ли объект близко к ней последний кадр
    mPushesLeftWall: false, //объект находится ли близко к стене

    //пол
    mWasOnGround: false, //находился ли объект близко к полу последний кадр
    mOnGround: false, //объект находится ли близко к полу

    //поталок
    mWasAtCeiling: false, //находился ли объект близко к потолку последний кадр
    mAtCeiling: false, //объект находится ли близко к потолку

    constructor(mPosition, mSpeed, mAABB, mScale) {//конструктор
        this.mPosition = mPosition;
        this.mSpeed = new Vector2(mSpeed, 0);
        this.mAABB = mAABB;
        this.mScale = mScale
        this.move = new Vector2(0, 0);
        this.mOldPosition = new Vector2(0, 0);
        this.mOldSpeed = new Vector2(0, 0);
    },

    setMove() {
        //по умолчанию игрок никуда не двигается
        this.move.x = 0;
        this.move.y = 0;

        //поймали событие обрабатываем
        if (eventsManager.action['up']) {
            this.move.y = 1;
            if (this.mWasOnGround) {
                this.mSpeed.y = -this.powerJump;
            }
            //if (this.mWasOnGround) { //подумать
            //this.mOnGround = false;
            //}
        }
        if (eventsManager.action['left']){
            this.move.x = -1;
        }
        if (eventsManager.action['right']){
            this.move.x = 1;
        }
    },

    //методы
    update() {//обновление состояния объекта
        //сохраняем предыдущие значения
        this.mOldPosition.copy(this.mPosition);
        this.mOldSpeed.copy(this.mSpeed);
        this.mPushedRightWall = this.mPushesRightWall;
        this.mPushedLeftWall = this.mPushesLeftWall;
        this.mWasOnGround = this.mOnGround;
        this.mWasAtCeiling = this.mAtCeiling;

        this.setMove();

        if (!this.mOnGround) {
            this.move.y = 1;
        }
        //if (this.move.x === 0 && this.move.y === 0)
        //   return 'stop'; //скорость движения нулевая

        //вычисение новых координат объекта
        let modX = Math.floor(this.move.x * this.mSpeed.x);
        let modY = Math.floor(this.move.y * this.mSpeed.y);

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
            this.mSpeed.y = 0;//-this.powerJump;
            this.mOnGround = true;
        } else {
            this.mSpeed.y += this.g;
            this.mOnGround = false;
        }

        //console.log(tsRightDown, tsRightUp);
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
        if (modX === 0 && modY === 0){
            return "idle";
        } else if (modY < 0){
            //прыжок
        } else if (modX > 0){
            return "runRight";
            //бег вправо
        } else if (modX < 0){
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

    entityAtXY(obj, x, y) {//определение столкновения объекта по заданным координатам
        for (let i = 0; i < gameManager.entities.length; i++) {
            let e = gameManager.entities[i]; //все объекты карты
            if (e.name !== obj.name) { //имя не совпадает (имена уникальны)
                if (x + obj.size_x < e.pos_x || //не пересекаются
                    y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x ||
                    y > e.pos_y + e.size_y)
                    continue;
                return e; //найден объект
            }
        }
        return null; //объект не найден
    }
};
