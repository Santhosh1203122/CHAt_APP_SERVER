"use strict";
const repo = require('./repo');

class DirectMessageService {
    async createDirectMessage(params) {
        return await repo.createDirectMessage(params).then(data => {
            return data;
        });
    }
    async sendDirectMessage(params) {
        return await repo.sendDirectMessage(params).then(data => {
            return data;
        });
    }
    async getImMessageForUsers(params) {
        return await repo.getImMessageForUsers(params).then(data => {
            return data;
        });
    }
}

module.exports = new DirectMessageService();