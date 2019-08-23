'use strict';

//менеджер событий
export let eventsManager = {
    //свойства
    bind: [], //сопостовления клавиш действиям
    action: [], //действия

    //методы
    setup() { //настройка клавиш и прявизки
        //настройка привязки к действию
        this.bind['Space'] = "up"; //пробел
        this.bind['KeyA'] = "left"; //a
        this.bind['KeyD'] = "right"; //d

        //настраиваем обработчик
        document.body.addEventListener("keydown", this.keyDown);
        document.body.addEventListener("keyup", this.keyUp);
    },

    keyDown(event) { //нажатие клавиши
        let action = eventsManager.bind[event.code]; //получаем действие по коду клавиши
        if (action) {
            eventsManager.action[action] = true; //согласились выполнить действие

        }
    },

    keyUp(event) { //отпустили клавишу
        let action = eventsManager.bind[event.code]; //получаем действие по коду клавиши

        if (action) {
            eventsManager.action[action] = false; //согласились выполнить действие

        }
    }

};