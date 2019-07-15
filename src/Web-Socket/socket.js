"use strict"
const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('subscribeToTimer', function (data) {
        console.log(data);
    });
});

const nsp = io.of('/my-namespace');
nsp.on('connection', function (socket) {
    console.log('someone connected');
});

io.listen(3000);

module.exports = app;