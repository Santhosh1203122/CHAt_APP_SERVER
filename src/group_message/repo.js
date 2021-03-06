"use strict";
const BaseRepo = require('../DB/baseRepo');

class Repo extends BaseRepo {
    constructor() {
        super();
        this.query = {
            getUserName: 'select user_name as userName from user_details as parent where parent.user_id = ?',
            sendGroupMessage: `INSERT INTO group_chat_messages (group_id, message, time, user_id, threads_count) VALUES (?, ?, ?, ?, ?)`,
            getMessageForGroup: `SELECT parent.*, child.user_name as userName FROM group_chat_messages as parent left join user_details as child on child.user_id = parent.user_id and parent.group_id = ? where parent.group_id = ? order by parent.time`,
            updateLastSeen: `UPDATE user_details as parent SET channels_last_seen_details = JSON_SET(parent.channels_last_seen_details, ?, ?) WHERE user_id= ?`
        }
    }

    async getMessageForGroup(params) {
        const query = this.query['getMessageForGroup'];
        const result = await this.executeQuery(query, [params.id, params.id]);
        // if (params.previousGroupId) {
        //     const updateLastSeen = this.query['getMessageForGroup'];
        //     const result = await this.executeQuery(query, [params.id, params.id]);
        // }
        return result;
    }
    async sendGroupMessage(params) {
        const sendGroupMessageQuery = this.query['sendGroupMessage'];
        const result = await this.executeQuery(sendGroupMessageQuery, [params.id, params.message, params.time, params.fromUser, 0]);
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