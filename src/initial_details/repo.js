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
            FROM chat_app.user_details as parent
            left join chat_app.user_details as child on json_contains(parent.im, CAST(child.user_id as JSON), '$') 
            where parent.user_id = ?`,
            getUsers: 'SELECT * FROM chat_app.user_details where user_name like ?',
            getUserDetails: 'select parent.user_name as userName from chat_app.user_details as parent where parent.user_id = ?',
            getGroupDetails: 'SELECT * FROM chat_app.groups where group_id = ?',
            getUserDetail: 'select * from chat_app.user_details where user_id = ?',
            initialGroupDetails: `SELECT  group_id, group_name
            FROM chat_app.groups
            where json_contains(members, CAST(? as JSON), '$') `,
            createGroup: `INSERT INTO groups (members, created_by, created, group_name) VALUES (JSON_ARRAY(?), ?, ?, ?)`,
            createDirectMessage: `UPDATE user_details set im = JSON_ARRAY_APPEND(im, '$', ?)  WHERE user_id=?`, 
            newlyCreatedGroup: 'SELECT * FROM groups ORDER BY group_id DESC LIMIT 1',
            updateGroup: `UPDATE chat_app.groups set members = JSON_ARRAY_APPEND(members, '$', ?)  WHERE group_id= ?`
        }
    }
    async getUserInitialDetails(params) {
        const createDirectMessageQuery = this.query['initialImDetails'];    
        const createInitialGroupQuery = this.query['initialGroupDetails'];
        const [resultInitialImDetails] = await this.executeQuery(createDirectMessageQuery, [params.userId]);
        const resultInitialGroupDetails = await this.executeQuery(createInitialGroupQuery, [params.userId]);
        const retrurnResult = resultInitialImDetails;
        retrurnResult.im_users = JSON.parse(retrurnResult.im_users);
        retrurnResult.groups = resultInitialGroupDetails;        
        return retrurnResult;  
    }

    async createIm(params) {
        const createDirectMessageQuery = this.query['createDirectMessage'];
        const getUserDetailsQuery = this.query['getUserDetails'];
        const updateToUser = await this.executeQuery(createDirectMessageQuery, [Number(params.fromUser) , params.toUser]);
        const updateFromUser = await this.executeQuery(createDirectMessageQuery, [params.toUser, Number(params.fromUser)]);
        const [getUserDetails] = await this.executeQuery(getUserDetailsQuery, [params.toUser]);
        const resp = {
            user_id: params.toUser,
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
        const query =  params.type === 'Groups' ? this.query['getGroupDetails'] : this.query['getUserDetail'];   
        const [result] = await this.executeQuery(query, [params.id]);
        result.type = params.type;
        return result;  
    }

    async updateGroup(params) {
        const query = this.query['updateGroup'];   
        await params.members.map(member => {
            return this.executeQuery(query, [member, params.id]);
        });
        return params;  
    }
    
    
}

module.exports = new Repo()