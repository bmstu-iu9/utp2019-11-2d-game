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
    player: null, //указатель на объект игрока
    laterKill: [], //отложенное уничтожение объектов
    initPlayer() { //инициализация игрока
        this.player = Object.create(Player);
        this.player.constructor(50, 60, 10)
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
        gameManager.factory['Player'] = this.player;
        gameManager.entities.push(gameManager.factory['Player']);
        //mapManager.parseEntities();
        eventsManager.setup();
    },

    updateWorld() {
        gameManager.update();
    },

    play() {
        setInterval(this.updateWorld, 100);
    }
};