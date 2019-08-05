'use strict'

let canvas = document.getElementById("canvasid"); //берем управление над canvas
let ctx = canvas.getContext("2d"); //подключаем 2d графику


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//описание объекта для управления картой
let mapManager = {
    //свойства объекта
    mapData: null, //переменная для хранения карты
    tLayer: [], //переменная для хранения ссылки на блоки карты
    xCount: 0, //кол-во блоков по горизонтали
    yCount: 0, //кол-во блоков по вертикали
    tSize: null, //размер блока
    mapSize: null, //размер карты в пикселях(вычисляется)
    tilesets: [], //массив описаний блоков карты
    imgLoadCount: 0, //кол-во загруженных изображений
    imgLoaded: false, //загруженны ли все изображения
    jsonLoaded: false, //разобран ли весь json

    //методы объекта

    //прогрузка карты
    //-----------------------------------------------------------------------------------------------------------------------
    loadMap(path){//функция для загрузки карты в программу
        //this.tilesets = new Array();
        let request = new XMLHttpRequest(); //создаем объект ajax запроса
        request.onreadystatechange = () =>{ //будет автоматически вызвана после отправки запроса (вне зависимости от результата)
            if (request.readyState === 4 && request.status === 200){ //информация о готовности ответа && код ответа
                //получен корректный ответ, результат можно обработать
                mapManager.parseMap(request.responseText);
            }
        };
        //this.parseMap()
        request.open("GET", path, true);
        //true - отправляет ассинхронный запрос
        //с использованием функции GET
        request.send();//отправляет запрос
    },

    parseMap(tilesJSON){
        this.mapData = JSON.parse(tilesJSON); //разобрать JSON
        //console.log(this.mapData.tilewidth);
        this.xCount = this.mapData.width; //сохранение ширины
        this.yCount = this.mapData.height; //сохранение высоты
        //сохранение размера блока
        this.tSize = {
            x: this.mapData.tilewidth,
            y: this.mapData.tileheight
        };
        this.mapSize = {
            x: this.xCount * this.tSize.x, //размер карты в пикселях (ширина)
            y: this.yCount * this.tSize.y //размер карты в пикселях (высота)
        };
        for (let i = 0; i < this.mapData.tilesets.length; i++){ //прогружаем все изображения из которых строится карта
            let img = new Image(); //создаем переменную для хранения изображения
            img.onload = () => { //запуститься при загрузке изображения
                mapManager.imgLoadCount++; //увеличиваем счетчик
                mapManager.imgLoaded = (mapManager.imgLoadCount === this.mapData.tilesets.length);
            };//конец описания функции onload
            let t = this.mapData.tilesets[i]; //забираем tileset из карты
            img.src = "maps/" + t.image; //задание пути к изображению
            let ts = { //создаем свой объект tileset
                firstId: t.firstgid, //с него начинается нумерация в data
                image: img, //объект рисунка
                name: t.name, //имя элемента рисунка
                xCount: Math.floor(t.imagewidth / this.tSize.x), //горизонталь в блоках
                yCount: Math.floor(t.imageheight / this.tSize.y) //вертикаль в блоках
            }; //конц объявления объекта ts
            //console.log(ts);
            //console.log(this.tilesets);
            this.tilesets.push(ts);
        }//окончание цикла for
        this.jsonLoaded = true; //true, разобрали весь json
        //console.log(mapManager.imgLoaded, mapManager.jsonLoaded);
        //console.log(1);
    },
    //-----------------------------------------------------------------------------------------------------------------------

    //прорисовка карты
    //-----------------------------------------------------------------------------------------------------------------------
    draw(ctx){//нарисовать карту в ctx
        //если карта не загружена, то повторить прорисовку через 100 мск
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded){
            //console.log(mapManager.imgLoaded, mapManager.jsonLoaded);
            setTimeout(() =>{mapManager.draw(ctx);}, 100);
        } else {
            if (this.tLayer.length === 0){//проверяем что tLayer настроен
                for (let id = 0; id < this.mapData.layers.length; id++){ //проходим по всем layer карты
                    let layer = this.mapData.layers[id];
                    //console.log(layer.type);
                    if (layer.type === "tilelayer"){ //если не tilelayer пропускаем
                        //console.log(layer);
                        this.tLayer.push(layer);
                        // break;
                    }
                }//окончание цикла for
            }
            //console.log(mapManager.tLayer);
            for (let id = 0; id < this.tLayer.length; id++) {
                for (let i = 0; i < this.tLayer[id].data.length; i++) {//пройти по всей карте
                    let a = this.tLayer[id].data[i];
                    if (a !== 0) { //если нет данных пропускаем
                        //console.log(a);
                        let tile = this.getTile(a);//получение блока по индексу
                        //i-проходит линейно по массиву, xCount-длина по x
                        let pX = (i % this.xCount) * this.tSize.x; //вычисляем x в пикселях
                        let pY = Math.floor(i / this.xCount) * this.tSize.y; //вычисяем y в пикселях
                        //рисуем в контексте
                        ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this
                            .tSize.y);
                    }
                }
            }
        }
    },

    getTile(tileIndex){//индекс блока
        let tile = {//один блок
            img: null, //изображение tileset
            px: 0, py: 0 //координаты блока в tileset
        };
        let tileset = this.getTileset(tileIndex);
        //console.log(tileset);
        tile.img = tileset.image;//изображение искомого tileset
        let id = tileIndex - tileset.firstId;//индекс блока в tileset
        //блок прямоугольный, остаток от деления на xCount дает x в tileset
        let x = id % tileset.xCount;
        //округление от деления дает y в tileset
        let y = Math.floor(id / tileset.xCount);
        //при помощи размеров блоков можем получить координаты блока в пикселях
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;//возращаем блок для отображения
    },

    getTileset(tileIndex){ //получение блока по индексу
        //console.log(this.tilesets);
        for (let i = this.tilesets.length - 1; i >= 0; i--){
            //в каждом tilesets[i].firstId записанно число с которого начинается нумерация блоков
            //console.log(this.tilesets[i]);
            if (this.tilesets[i].firstId <= tileIndex){//если индекс первого блока меньше или равен искомому значит этот tileset и нужен
                return this.tilesets[i];
            }
        }
        return null; //возращаем найденный tileset
    }
    //-----------------------------------------------------------------------------------------------------------------------
};

mapManager.loadMap("maps/tilemap.json");
mapManager.draw(ctx);