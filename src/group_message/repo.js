"use strict";
const BaseRepo = require('../DB/baseRepo');

class Repo extends BaseRepo {
    constructor() {
        super();
        this.query = {
            getUserName: 'select user_name as userName from user_details as parent where parent.user_id = ?',
            sendGroupMessage: `INSERT INTO group_chat_messages (group_id, message, time, user_id) VALUES (?, ?, ?, ?)`,
            newlyCreatedGroup: 'SELECT * FROM groups ORDER BY group_id DESC LIMIT 1',
            createGroup: `INSERT INTO groups (members, created_by, created, group_name) VALUES (JSON_ARRAY(?), ?, ?, ?)`,
            getMessageForGroup: `SELECT parent.*, child.user_name as userName FROM chat_app.group_chat_messages as parent left join chat_app.user_details as child on child.user_id = parent.user_id and parent.group_id = ? where parent.group_id = ?`,
        }
    }
    async createGroup(params) {
        const createDirectMessageQuery = this.query['createGroup'];
        const result = await this.executeQuery(createDirectMessageQuery, [params.members, params.createdBy, params.time, params.groupName]);
        const getNewlyCreatedGroupQuery = this.query['newlyCreatedGroup'];
        const [returnResult] = await this.executeQuery(getNewlyCreatedGroupQuery);
        return returnResult;
    }

    async getMessageForGroup(params) {
        const query = this.query['getMessageForGroup'];
        const result = await this.executeQuery(query, [params.id, params.id]);
        return result;
    }
    async sendGroupMessage(params) {
        const sendGroupMessageQuery = this.query['sendGroupMessage'];
        const result = await this.executeQuery(sendGroupMessageQuery, [params.id, params.message, params.time, params.fromUser]);
        if (result.affectedRows === 1) {
            const getUserQuery = this.query['getUserName']
            const [userResult] = await this.executeQuery(getUserQuery, [params.fromUser]);
            params.userName = userResult.userName;
            return params
            
        } else {
            return result;
        }
    }
}

module.exports = new Repo()