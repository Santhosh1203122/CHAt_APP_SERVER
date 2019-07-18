"use strict";
const repo = require('./repo');

class InitialService {
    async getUserInitialDetails(params) {
        return await repo.getUserInitialDetails(params).then(data => {
            return data;
        });
    }
    async createIm(params) {
        return await repo.createIm(params).then(data => {
            return data;
        });
    }
    async createGroup(params) {
        return await repo.createGroup(params).then(data => {
            return data;
        });
    }
    async getUsers(params) {
        return await repo.getUsers(params).then(data => {
            return data;
        });
    }
    async getChannelDetails(params) {
        return await repo.getChannelDetails(params).then(data => {
            return data;
        });
    }
    async updateGroup(params) {
        return await repo.updateGroup(params).then(data => {
            return data;
        });
    }
    
    
    
    
}

module.exports = new InitialService();