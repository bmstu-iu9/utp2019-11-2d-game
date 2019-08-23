'use strict';

import {mapManager} from './mapManager.js';

// объект для управления спрайтами
export let spriteManager = {
    image: new Image(), // рисунок с объектами
    sprites: [], // массив объктов для отображения
    imgLoaded: false, // изображения загружены
    jsonLoaded: false, // JSON загружен

    loadAtlas(atlasJson, atlasIMG) { // загрузка атласа изображения
        let request = new XMLHttpRequest(); // подготовить запрос на разбор атласа
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                spriteManager.parseAtlas(request.responseText) // успешно получили атлас
            }
        };
        request.open("GET", atlasJson, true); // асинхронный запрос на разбор атласа
        request.send(); // отправили запрос
        this.loadImg(atlasIMG); // загрузка изображения
        //console.log(100);
    },

    loadImg(imgName) { // загрузка изображения
        this.image.onload = function () {
            spriteManager.imgLoaded = true;// когда изображение загружено, установить в true
        };
        this.image.src = imgName; // загрузка изображения
    },

    parseAtlas(atlasJSON) { // разобрать атлас с объектами
        let atlas = JSON.parse(atlasJSON);
        for (let name in atlas.frames) { // проход по всем именам в frames
            let frame = atlas.frames[name].frame; // получение спрайта и сохранение в frame
            // сохранение характеристик frame в виде объекта
            this.sprites.push({name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h});
        }
        this.jsonLoaded = true; // true, когда разобрали весь атлас
    },

    drawSprite(ctx, name, x, y) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            // если изображение не загружено, то повторить запрос через 100 мсек
            setTimeout(function () {
                spriteManager.drawSprite(ctx, name, x, y);
            }, 100)
        } else {
            let sprite = this.getSprite(name); // получить спрайт по имени
            //console.log(sprite);
            if (!mapManager.isVisible(x, y, sprite.w, sprite.h))
                return; // не рисуем за пределом видимой зоны
            // отображаем спрайт на холсте
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h)
        }
    },

    getSprite(name) { // получить объект по имени
        for (let i = 0; i < this.sprites.length; i++) {
            let s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null;
    },

    drawHitBox(ctx, box) {//прорисовка hitBox
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(Math.round(box.center.x - box.halfSize.x), Math.round(box.center.y - box.halfSize.y), Math.round(box.halfSize.x * 2), Math.round(box.halfSize.y * 2));
        ctx.stroke();
    }
};