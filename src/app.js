"use strict"
const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
var cors = require('cors');
app.use(cors());
app.use('/api', require('./direct_message/router'));
app.use('/api', require('./group_message/router'));
app.use('/api', require('./initial_details/router'));
app.use(express.static('images'))

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('subscribeToTimer', function (data) {
        console.log(data);
    });
});
io.listen(3000);

module.exports = app;