"use strict"
const express = require('express');
const router = express.Router();
const service = require('./service');
const CustomWebSocket = require('../Web-Socket/socket');
const webSocket = new CustomWebSocket();
const loadedVal = [];

function createNameSpace(ids, type) {
    let nameSpaceId = ids;
    if (type === 'Im/') {
        nameSpaceId = ids.resp_user_id < ids.user_user_id ? ids.resp_user_id + ':' + ids.user_user_id : ids.user_user_id + ':' + ids.resp_user_id;
    }
    if (!loadedVal.includes(nameSpaceId)) {
        loadedVal.push(nameSpaceId)
        webSocket.createNewNameSpace(type ? (type + nameSpaceId) : nameSpaceId)
    }
}

router.get("/getInitialDetails", async (req, res) => {
    try {
        let resp = await service.getUserInitialDetails(req.query);
        if (resp.groups) {
            resp.groups.forEach(group => {
                createNameSpace(group.group_id, 'Groups/')
            });
        }
        if (resp.im_users) {
            resp.im_users.forEach(user => {
                const ids = { resp_user_id: resp.user_id, user_user_id: user.user_id }
                createNameSpace(ids, 'Im/')
            });
        }
        if (resp.user_id) {
            createNameSpace('User/' + resp.user_id, null)
        }
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.post("/createIm", async (req, res) => {
    try {
        let resp = await service.createIm(req.body);
        const ids = { resp_user_id: resp.user_id, user_user_id: resp.updateFromUser };
        createNameSpace(ids, 'Im/');
        webSocket.emitNewImToUser('User/' + resp.user_id, resp);
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.post("/createGroup", async (req, res) => {
    try {
        let resp = await service.createGroup(req.body);
        if(resp) {
            createNameSpace(resp.group_id, 'Groups/');
        }
        if(resp.members) {
            resp.members.forEach(member => {
                webSocket.emitNewGroupToUser('User/' + member, resp);
            });            
        }
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.get("/searchUsers", async (req, res) => {
    try {
        let resp = await service.getUsers(req.query);
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.get("/getChannelDetails", async (req, res) => {
    try {
        let resp = await service.getChannelDetails(req.query);
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.post("/updateGroup", async (req, res) => {
    try {
        let resp = await service.updateGroup(req.body);
        if(resp) {
            createNameSpace(resp.group_id, 'Groups/');
        }
        if(resp.members) {
            resp.members.forEach(member => {
                webSocket.emitNewGroupToUser('User/' + member, {group_id: member, group_name: resp.groupName});
            });            
        }
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
}); 



module.exports = router;