"use strict";
const repo = require('./repo');

class DirectMessageService {
    async getMessageForGroup(params) {
        return await repo.getMessageForGroup(params).then(data => {
            return data;
        });
    }
    async createGroup(params) {
        return await repo.createGroup(params).then(data => {
            return data;
        });
    }
    async sendGroupMessage(params) {
        return await repo.sendGroupMessage(params).then(data => {
            return data;
        });
    }
    
}

module.exports = new DirectMessageService();