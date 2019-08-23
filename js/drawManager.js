'use strict';

export let drawManager = { // объект для выбора кадра в прорисовку
    state: null, // текущее состояние
    frame: null, // номер кадра в текущей анимации
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
        switch (this.state) {
            case "idle":
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
                break;
            case "runRight":
                switch (this.frame) {
                    case 6:
                        this.frame = 0;
                        this.frame = '';
                        break;
                }
        }

    },

    getSpriteName() {
        return this.frameName;
    },
};