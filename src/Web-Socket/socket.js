"use strict"
const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {path:  '/connectSocket/socket.io'});
io.listen(444);

class WebSocket {
    createNewNameSpace (nameSpace){
        console.log(nameSpace);
        io.of(nameSpace).on('connection', function (socket) {
            console.log('create name space: ',  nameSpace)
            socket.on('receive message', function (msg) {
                io.of(nameSpace).emit('emit message', msg)
            });
        });
    }
    emitNewImToUser(nameSpaceId,  val) {
        io.of(nameSpaceId).emit('Update New Im', val)
    }
    emitNewGroupToUser(nameSpaceId,  val) {
        io.of(nameSpaceId).emit('Update New Group', val)
    }
}
module.exports = WebSocket;