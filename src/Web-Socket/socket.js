"use strict"
var connectIo = require('./io');

class WebSocket {
    createNewNameSpace(nameSpace) {
        console.log(nameSpace, connectIo);
        connectIo.io().of(nameSpace).on('connection', function (socket) {
            console.log('create name space: ', nameSpace)
            socket.on('receive message', function (msg) {
                connectIo.io().of(nameSpace).emit('emit message', msg)
            });
        });
    }
    emitNewImToUser(nameSpaceId, val) {
        connectIo.io().of(nameSpaceId).emit('Update New Im', val)
    }
    emitNewGroupToUser(nameSpaceId, val) {
        connectIo.io().of(nameSpaceId).emit('Update New Group', val)
    }
}

module.exports = WebSocket;