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
            initialGroupDetails: `SELECT  group_id, group_name
            FROM chat_app.groups
            where json_contains(members, CAST(? as JSON), '$') `,
            getNoOfVideos: 'SELECT COUNT(*) as count FROM video_app.video_list'
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
}

module.exports = new Repo()