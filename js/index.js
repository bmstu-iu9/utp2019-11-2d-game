'use strict'
var canvas = document.getElementById("canvasid");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/*
class MovingManager { //Перемещение объекта
    move = null; //направление движения

    mOldPosition = null; //положение на предыдущем кадре
    mPosition = null; //текущее положение

    mOldSpeed = null; //скорость предыдущем кадре
    mSpeed = null; //текущая скорость

    //mScale = null; //масштаб

    mAABB = null; //хит бокс
    //mAABBOffset = null; //смещение хит бокса

    //стена справа
    mPushedRightWall = false; //находился ли объект близко к ней последний кадр
    mPushesRightWall = false; //объект находится ли близко к стене

    //стена слева
    mPushedLeftWall = false; //находился ли объект близко к ней последний кадр
    mPushesLeftWall = false; //объект находится ли близко к стене

    //пол
    mWasOnGround = false; //находился ли объект близко к полу последний кадр
    mOnGround = false; //объект находится ли близко к полу

    //поталок
    mWasAtCeiling = false; //находился ли объект близко к поталку последний кадр
    mAtCeiling = false; //объект находится ли близко к поталку

    constructor(mPosition, mSpeed, mAABB){//конструктор
        this.mPosition = mPosition;
        this.mSpeed = mSpeed;
        this.mAABB = mAABB;
    };

    setMove(){
        //по умолчанию игрок никуда не двигается
        this.move.x = 0;
        this.move.y = 0;

        //поймали событие обрабатываем
        if (eventsManager.action['up']) this.move.y = -1;
        if (eventsManager.action['down']) this.move.y = 1;
        if (eventsManager.action['left']) this.move.x = -1;
        if (eventsManager.action['right']) this.move.x = 1;
    };

    UpdatePhisics(){ //обновление движения
        //сохраняем предыдущие значения
        this.mOldPosition = this.mPosition;
        this.mOldSpeed = this.mSpeed;
        this.mPushedRightWall = this.mPushesRightWall;
        this.mPushedLeftWall = this.mPushesLeftWall;
        this.mWasOnGround = this.mOnGround;
        this.mWasAtCeiling = this.mAtCeiling;

        this.mPosition.x += Math.floor(this.move.x * );
    };
};
*/