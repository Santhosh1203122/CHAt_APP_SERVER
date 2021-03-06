"use strict";
const BaseRepo = require('../DB/baseRepo');


class Repo extends BaseRepo {
    constructor() {
        super();
        this.query = {
            initialImDetails: `SELECT parent.*, 
            CONCAT(
              '[',group_concat(JSON_OBJECT('user_id', child.user_id, 'user_name', child.user_name, 'last_seen',child.last_seen)),
              ']'
            ) as im_users 
            FROM user_details as parent
            left join user_details as child on json_contains(parent.im, CAST(child.user_id as JSON), '$') 
            where parent.user_id = ?`,
            getUsers: 'SELECT * FROM user_details where user_name like ?',
            getUserDetails: 'select parent.user_name as userName from user_details as parent where parent.user_id = ?',
            getGroupDetails: 'SELECT * FROM groups where group_id = ?',
            getUserDetail: 'select * from user_details where user_id = ?',
            initialGroupDetails: `SELECT  group_id, group_name
            FROM groups
            where json_contains(members, CAST(? as JSON), '$') `,
            createGroup: `INSERT INTO groups (members, created_by, created, group_name) VALUES (JSON_ARRAY(?), ?, ?, ?)`,
            createDirectMessage: `UPDATE user_details set im = JSON_ARRAY_APPEND(im, '$', ?)  WHERE user_id=?`,
            newlyCreatedGroup: 'SELECT * FROM groups ORDER BY group_id DESC LIMIT 1',
            getMembersInGroup: `select members FROM groups where group_id =`,
            updateGroup: `UPDATE groups set members = JSON_ARRAY_APPEND(members, '$', ?)  WHERE group_id= ?`,
            sendThreadMessageQuery: `INSERT INTO thread_messages (chat_id, time, message, from_user, user_name, chat_type, users_id, group_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            getThreadMessageQueryForIm: `SELECT * FROM thread_messages where chat_id = ? and chat_type = ? and users_id = ?`,
            getThreadMessageQueryForGroup: `SELECT * FROM thread_messages where chat_id = ? and chat_type = ? and group_id = ?`,
            updateThreadCountForGroup:`UPDATE group_chat_messages SET threads_count= threads_count + 1 WHERE chat_id=?`,
            updateThreadCountForIm: `UPDATE im_chat_messages SET threads_count= threads_count + 1 WHERE chat_id=?`

        }
    }
    async getUserInitialDetails(params) {
        const createDirectMessageQuery = this.query['initialImDetails'];
        const createInitialGroupQuery = this.query['initialGroupDetails'];
        const [resultInitialImDetails] = await this.executeQuery(createDirectMessageQuery, [params.userId]);
        const resultInitialGroupDetails = await this.executeQuery(createInitialGroupQuery, [params.userId]);
        const retrurnResult = resultInitialImDetails;
        const im_users = JSON.parse(retrurnResult.im_users);
        if (im_users && im_users.length === 1 && im_users[0].user_id === null) {
            retrurnResult.im_users = [];
        } else {
            retrurnResult.im_users = im_users;
        }
        retrurnResult.groups = resultInitialGroupDetails;
        return retrurnResult;
    }

    async createIm(params) {
        const createDirectMessageQuery = this.query['createDirectMessage'];
        const getUserDetailsQuery = this.query['getUserDetails'];
        const updateToUser = await this.executeQuery(createDirectMessageQuery, [Number(params.fromUser), params.toUser]);
        const updateFromUser = await this.executeQuery(createDirectMessageQuery, [params.toUser, Number(params.fromUser)]);
        const [getUserDetails] = await this.executeQuery(getUserDetailsQuery, [params.toUser]);
        const resp = {
            from_user_name: params.userName,
            user_id: params.fromUser,
            to_user: params.toUser,
            updateFromUser: params.fromUser,
            user_name: getUserDetails.userName
        }
        return resp;
    }

    async createGroup(params) {
        const createGroupQuery = this.query['createGroup'];
        const result = await this.executeQuery(createGroupQuery, [params.members, params.createdBy, params.time, params.groupName]);
        const getNewlyCreatedGroupQuery = this.query['newlyCreatedGroup'];
        const [returnResult] = await this.executeQuery(getNewlyCreatedGroupQuery);
        return returnResult;
    }

    async getUsers(params) {
        const getUsersQuery = this.query['getUsers'];
        const users = await this.executeQuery(getUsersQuery, [params.searchString + '%']);
        return users;
    }

    async getChannelDetails(params) {
        const query = params.type === 'Groups' ? this.query['getGroupDetails'] : this.query['getUserDetail'];
        const [result] = await this.executeQuery(query, [params.id]);
        result.type = params.type;
        return result;
    }

    async updateGroup(params) {
        const query = this.query['updateGroup'];
        await params.members.map(async member => {
            await this.executeQuery(query, [member, params.id]);
        });
        return params;
    }

    async sendThreadMessage(params) {
        const query = this.query['sendThreadMessageQuery'];
        const result = await this.executeQuery(query, [params.id, params.time, params.message, params.fromUser, params.userName, params.chat_type, params.users_id, params.group_id]);
        if (params.group_id) {
            const query = this.query['updateThreadCountForGroup'];
            const result = await this.executeQuery(query, [params.id]);
        } else {
            const query = this.query['updateThreadCountForIm'];
            const result = await this.executeQuery(query, [params.id]);
        }
        return params;
    }

    async getThreadMessage(params) {
        if (params.group_id) {
            const query = this.query['getThreadMessageQueryForGroup'];
            const result = await this.executeQuery(query, [params.chat_id, params.chat_type, params.group_id]);
            return result;
        } else {
            const query = this.query['getThreadMessageQueryForIm'];
            const result = await this.executeQuery(query, [params.chat_id, params.chat_type, params.users_id]);
            return result;
        }

    }


}

module.exports = new Repo()