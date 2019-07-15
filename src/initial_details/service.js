"use strict";
const repo = require('./repo');

class InitialService {
    async getUserInitialDetails(params) {
        return await repo.getUserInitialDetails(params).then(data => {
            return data;
        });
    }
}

module.exports = new InitialService();