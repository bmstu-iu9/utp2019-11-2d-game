'use strict';

//менеджер событий
export let eventsManager = {
    //свойства
    bind: [], //сопостовления клавиш действиям
    action: [], //действия

    //методы
    setup() { //настройка клавиш и прявизки
        //настройка привязки к действию
        this.bind['Space'] = "up0"; //пробел
        this.bind['KeyA'] = "left0"; //a
        this.bind['KeyD'] = "right0"; //d
        this.bind['Enter'] = "up1";
        this.bind['ArrowLeft'] = "left1";
        this.bind['ArrowRight'] = "right1";
        this.bind['ShiftRight'] = "attack1";
        this.bind['ShiftLeft'] = "attack0";

        //настраиваем обработчик
        document.body.addEventListener("keydown", this.keyDown);
        document.body.addEventListener("keyup", this.keyUp);
    },

    keyDown(event) { //нажатие клавиши
        let action = eventsManager.bind[event.code]; //получаем действие по коду клавиши
        console.log(event.code);
        if (action) {
            eventsManager.action[action] = true; //согласились выполнить действие

        }
    },

    keyUp(event) { //отпустили клавишу
        if (eventsManager.bind[event.code] !== 'attack1' && eventsManager.bind[event.code] !== 'attack0') {
            let action = eventsManager.bind[event.code]; //получаем действие по коду клавиши

            if (action) {
                eventsManager.action[action] = false; //согласились выполнить действие

            }
        }
    }

};