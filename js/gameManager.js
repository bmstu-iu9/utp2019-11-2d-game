'use strict';

import {spriteManager} from './spriteManager.js';
import {mapManager} from './mapManager.js';
import {eventsManager} from './eventsManager.js';
import {Player} from './player.js';
import {ctx} from "./index.js";

//менеджер игры
export let gameManager = {
    factory: {}, //фабрика объектов на карте
    entities: [], //объекты на карте
    player: [], //указатель на объект игрока
    laterKill: [], //отложенное уничтожение объектов
    timeId: null,

    initPlayer() { //инициализация игрока
        this.player[0] = Player.createObject(50, 60, 10, {
            up: "up0",
            left: "left0",
            right: "right0",
            attack: "attack0"
        }, 'player0', 3);
        this.player[1] = Player.createObject(100 , 100, 10,{
            up: "up1",
            left: "left1",
            right: "right1",
            attack: "attack1"
        }, 'player1', 3);
    },
    kill(obj) {
        this.laterKill.push(obj);
    },
    draw(ctx) {
        for (let e = 0; e < this.entities.length; e++) {
            this.entities[e].draw(ctx);
        }
    },
    update() {//обновление информации
        if (this.player === null) {
            return;
        }

        //this.player.setMove();

        //обновление информации по всем объектам на карте
        this.entities.forEach((e) => {
            try{ //защита от ошибок при выполнении update
                e.update();
                if (e.life === 0){
                    clearInterval(this.timeId);
                    if (confirm("Проиграл: " + e.name)) {
                        console.log(1);
                        gameManager.entities.length = 0;
                        gameManager.initPlayer();
                        gameManager.play();
                    }
                }
            } catch (ex) {
                console.log(-1);
            }
        });

        //удаление всех объектов, попавших в laterKill
        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1)
                this.entities.splice(idx, 1); //удаление из массива 1 объекта
        };

        if (this.laterKill.length > 0) //очистка массива laterKill
            this.laterKill.length = 0;

        mapManager.draw(ctx);
        this.draw(ctx);
    },

    loadAll() {
        mapManager.loadMap("maps/tilemap.json");
        spriteManager.loadAtlas("maps/sprites.json", "maps/spritesheet.png");
        gameManager.initPlayer();
        //mapManager.parseEntities();
        eventsManager.setup();
    },

    updateWorld() {
        gameManager.update();
    },

    play() {
        gameManager.factory['Player0'] = this.player[0];
        gameManager.factory['Player1'] = this.player[1];
        gameManager.entities.push(gameManager.factory['Player0']);
        gameManager.entities.push(gameManager.factory['Player1']);
        this.timeId = setInterval(this.updateWorld, 100);
    }
};