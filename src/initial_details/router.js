"use strict"
const express = require('express');
const router = express.Router();
const service = require('./service');
const CustomWebSocket = require('../Web-Socket/socket');
const webSocket = new CustomWebSocket();
const loadedVal = [];

router.get("/getInitialDetails", async (req, res) => {
    try {
        let resp = await service.getUserInitialDetails(req.query);
        if (resp.groups) {
            resp.groups.forEach(group => {
                if (!loadedVal.includes(group.group_id)) {
                    loadedVal.push(group.group_id)
                    webSocket.createNewNameSpace('Groups/' + group.group_id)
                }
            });
        }
        if(resp.im_users) {
            resp.im_users.forEach(user => {
                const createNameSpaceId = resp.user_id < user.user_id ? resp.user_id + ':' + user.user_id :  user.user_id + ':' + resp.user_id;
                if (!loadedVal.includes(createNameSpaceId)) {
                    loadedVal.push(createNameSpaceId)
                    webSocket.createNewNameSpace('Im/' + createNameSpaceId)
                }
            });
        }
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

module.exports = router;