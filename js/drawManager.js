'use strict';

export let drawManager = { // объект для выбора кадра в прорисовку
    state: null, // текущее состояние
    frame: null, // номер кадра в текущей анимации
    direction: null, // направление персонажа: лево/право
    frameName: null, // имя спрайта

    updateState(newState) {
        if (newState === this.state) { // если состояние не изменилось, набор кадров не меняется
            this.nextFrame();
        } else {
            this.state = newState;
            this.frame = 0;
        }
    },

    nextFrame() { // выбор номера следующего кадра

            if (this.state === "idle") {
                switch (this.frame) {
                    case 3:
                        this.frame = 0;
                        this.frameName = 'adventurer-idle-2-00';
                        break;
                    case 0:
                        this.frame++;
                        this.frameName = 'adventurer-idle-2-01';
                        break;
                    case 1:
                        this.frame++;
                        this.frameName = 'adventurer-idle-2-02';
                        break;
                    case 2:
                        this.frame++;
                        this.frameName = 'adventurer-idle-2-03';
                        break;
                }
            } else if (this.state === "runRight" || this.state === "runLeft") {
                if (this.state === "runRight") {
                    this.direction = false;
                } else {
                    this.direction = true;
                }
                switch (this.frame) {
                    case 5:
                        this.frame = 0;
                        this.frameName = 'adventurer-run3-00';
                        break;
                    case 0:
                        this.frame++;
                        this.frameName = 'adventurer-run3-01';
                        break;
                    case 1:
                        this.frame++;
                        this.frameName = 'adventurer-run3-02';
                        break;
                    case 2:
                        this.frame++;
                        this.frameName = 'adventurer-run3-03';
                        break;
                    case 3:
                        this.frame++;
                        this.frameName = 'adventurer-run3-04';
                        break;
                    case 4:
                        this.frame++;
                        this.frameName = 'adventurer-run3-05';
                        break;
                }
            } else if (this.state === "jumpRight" || this.state === "jumpLeft" || this.state === "jump") {
                if (this.state === "jumpRight") {
                    this.direction = false;
                } else {
                    this.direction = true;
                }
                switch (this.frame) {
                    case 3:
                        this.frame = 0;
                        this.frameName = 'adventurer-jump-00';
                        break;
                    case 0:
                        this.frame++;
                        this.frameName = 'adventurer-jump-01';
                        break;
                    case 1:
                        this.frame++;
                        this.frameName = 'adventurer-jump-02';
                        break;
                    case 2:
                        this.frame++;
                        this.frameName = 'adventurer-jump-03';
                        break;
                }
            } else if (this.state === "fallRight" || this.state ===  "fallLeft" || this.state ===  "fall") {
                if (this.state === "fallRight") {
                    this.direction = false;
                } else {
                    this.direction = true;
                }
                switch (this.frame) {
                    case 1:
                        this.frame = 0;
                        this.frameName = 'adventurer-fall-00';
                        break;
                    case 0:
                        this.frame++;
                        this.frameName = 'adventurer-fall-01';
                        break;
                }
            }
    },

    getSpriteName() {
        if (this.direction) {
            return this.frameName + "-mirror";
        } else {
            return this.frameName
        }
    },
};