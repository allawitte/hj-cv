'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/hr', express.static('hr'));
app.use('/', express.static('client'));


const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({port: 2222});

wss.on("connection", (ws) => {
    console.info("websocket connection open");
    ws.on('message', function (data) {
        let recivedMsg = JSON.parse(data);
        console.log('recivedMsg', recivedMsg)
        if (recivedMsg.type == 'name') {
            console.log('hello')
            let message = {
                to: 'hr',
                text: data.text + '  в чате'
            };
            console.log('wss.clients', wss.clients);
            wss.clients.forEach(conn => {
                conn.send(JSON.stringify(message));
            });
        }

    });
});


//
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// io.on('connection', function(){ console.log('connection') });
//http.listen('3000');
app.listen('3000', function () {
    console.log('Example app listening on port 3000');
});
/**
 * Created by HP on 1/18/2018.
 */
