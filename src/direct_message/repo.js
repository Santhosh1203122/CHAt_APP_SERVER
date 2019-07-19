"use strict";
const BaseRepo = require('../DB/baseRepo');

class Repo extends BaseRepo {
    constructor() {
        super();
        this.query = {
            getUserName: 'select user_name as userName from user_details as parent where parent.user_id = ?',
            createDirectMessage: `UPDATE user_details set im = JSON_ARRAY_APPEND(im, '$', ?)  WHERE user_id=?`,
            sendDirectMessage: `INSERT INTO im_chat_messages (users_id, message, time, from_user, threads_count) VALUES (?, ?, ?, ?, ?)`,
            getImMessageForUsers: 'SELECT parent.*, child.user_name as userName FROM im_chat_messages as parent left outer join user_details as child on child.user_id = ? where users_id = ? order by parent.time'
        }
    }
    async createDirectMessage(params) {
        const createDirectMessageQuery = this.query['createDirectMessage'];
        const result = await this.executeQuery(createDirectMessageQuery, [params.from, params.toUser]);
        const appendToUser = await this.executeQuery(createDirectMessageQuery, [params.toUser, Number(params.fromUser)]);
        return result;  
    }
    async sendDirectMessage(params) {
        const sendDirectMessageeQuery = this.query['sendDirectMessage'];
        const result = await this.executeQuery(sendDirectMessageeQuery, [params.id, params.message, params.time, params.fromUser, 0]);
        if(result.affectedRows === 1) {
            const getUserQuery = this.query['getUserName']
            const [userResult] = await this.executeQuery(getUserQuery, [params.fromUser]);
            params.userName = userResult.userName;
            return params
        } else {
            return result;
        }  
    }
    async getImMessageForUsers(params) {
        const query = this.query['getImMessageForUsers'];
        const users_id = params.fromUser < params.toUser ? (params.fromUser + ':' + params.toUser) : (params.toUser + ':' + params.fromUser)
        const result = await this.executeQuery(query, [users_id, users_id]);
        return result;  
    }
}

module.exports = new Repo()