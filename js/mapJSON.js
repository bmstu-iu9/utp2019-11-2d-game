'use strict'

var canvas = document.getElementById("canvasid"); //берем управление над canvas
var ctx = canvas.getContext("2d"); //подключаем 2d графику

//можем подключить полноэкранный режим
/*
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
*/

//описание объекта для управления картой
let mapManager = {
    //свойства объекта
    mapData: null, //переменная для хранения карты
    tLayer: null, //переменная для хранения ссылки на блоки карты
    xCount: 0, //кол-во блоков по горизонтали
    yCount: 0, //кол-во блоков по вертикали
    tSize: {x: 0, y: 0}, //размер блока
    mapSize: {x: 0, y: 0}, //размер карты в пикселях(вычисляется)
    tilesets: new Array(), //массив описаний блоков карты
    imgLoadCount: 0, //кол-во загруженных изображений
    imgLoaded: false, //загруженны ли все изображения
    jsonLoaded: false, //разобран ли весь json

    //методы объекта

    //прогрузка карты
    //-----------------------------------------------------------------------------------------------------------------------
    loadMap: (path) =>{//функция для загрузки карты в программу
        let request = new XMLHttpRequest(); //создаем объект ajax запроса

        request.onreadystatechange = () =>{ //будет автоматически вызвана после отправки запроса (вне зависимости от результата)
            if (request.readyState === 4 && request.status === 200){ //информация о готовности ответа && код ответа
                //получен корректный ответ, результат можно обработать
                mapManager.parseMap(request.responseText);
            }
        };

        request.open("GET", path, true);
        //true - отправляет ассинхронный запрос
        //с использованием функции GET
        request.send();//отправляет запрос
    },

    parseMap: (tilesJSON) =>{
        this.mapData = JSON.parse(tilesJSON); //разобрать JSON
        this.xCount = this.mapData.width; //сохранение ширины
        this.yCount = this.mapData.height; //сохранение высоты
        this.tSize.x = this.mapData.tilewidth; //сохранение размера блока (ширана в пикселях)
        this.tSize.y = this.mapData.tileheight; //сохранение размера блока (высота в пикселях)
        this.mapSize.x = this.xCount * this.tSize.x; //размер карты в пикселях (ширина)
        this.mapSize.y = this.yCount * this.tSize.y; //размер карты в пикселях (высота)
        for (let i = 0; i < this.mapData.tilesets.length; i++){ //прогружаем все изображения из которых строится карта
            let img = new Image(); //создаем переменную для хранения изображения
            img.onload = () => { //запуститься при загрузке изображения
                mapManager.imgLoadCount++; //увеличиваем счетчик
                mapManager.imgLoaded = (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) ? true : false;
            };//конец описания функции onload
            let t = this.mapData.tilesets[i]; //забираем tileset из карты
            img.src = t.image; //задание пути к изображению
            let ts = { //создаем свой объект tileset
                firstId: t.firstId, //с него начинается нумерация в data
                image: img, //объект рисунка
                name: t.name, //имя элемента рисунка
                xCount: Math.floor(t.image.width / mapManager.tSize.x), //горизонталь в блоках
                yCount: Math.floor(t.image.height / mapManager.tSize.y) //вертикаль в блоках
            }; //конц объявления объекта ts
            this.tilesets.push(ts);
        }//окончание цикла for
        this.jsonLoaded = true; //true, разобрали весь json
    },
    //-----------------------------------------------------------------------------------------------------------------------

    //прорисовка карты
    //-----------------------------------------------------------------------------------------------------------------------
    draw: (ctx) =>{//нарисовать карту в ctx
        //если карта не загружена, то повторить прорисовку через 100 мск
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded){
            setTimeout(() =>{mapManager.draw(ctx);}, 100);
        } else {
            if (this.tLayer === null){//проверяем что tLayer настроен
                for (let id = 0; id < this.mapData.layers.length; id++){ //проходим по всем layer карты
                    let layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer"){ //если не tilelayer пропускаем
                        this.tLayer = layer;
                        break;
                    }
                }//окончание цикла for
            }
            for (let i = 0; i < this.tLayer.data.length; i++){//пройти по всей карте
                if (this.tLayer.data[i] !== 0){

                }
            }
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------
}

mapManager.loadMap("../maps/tilemap.json");
console.log(mapManager.imgLoaded);