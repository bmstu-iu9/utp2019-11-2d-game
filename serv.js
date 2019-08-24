'use strict';

const http = require("http");
const fs = require("fs");

http.createServer(function(request, response){

    const url = request.url;
    const extension = url.substr(url.indexOf('.', 1) + 1);
    const path = __dirname + url;

    //console.log(extension);

    fs.access(path, fs.constants.R_OK, err => {
        // если произошла ошибка - отправляем статусный код 404
        if(err){
            response.writeHead(200, {'Content-Type': 'text/html'});
            fs.createReadStream(__dirname + "/404.html").pipe(response);
        }
        else{
            switch (extension) {
                case 'html':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    fs.createReadStream(path).pipe(response);
                    //console.log(1);
                    break;
                case 'js':
                    response.writeHead(200, {'Content-Type': 'text/javascript'});
                    fs.createReadStream(path).pipe(response);
                    //console.log(2);
                    break;
                case  'json':
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    fs.createReadStream(path).pipe(response);
                    break;
                case  'png':
                    response.writeHead(200, {'Content-Type': 'application/png'});
                    fs.createReadStream(path).pipe(response);
                    break;
            };
        }
    });
}).listen(3000, 'localhost', ()=>{
    console.log("Server is running!");
});