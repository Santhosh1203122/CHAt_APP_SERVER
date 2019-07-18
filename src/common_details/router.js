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
                if (resp.user_id && user.user_id) {
                    const ids = { resp_user_id: resp.user_id, user_user_id: user.user_id }
                    createNameSpace(ids, 'Im/')
                }
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
        const ids = { resp_user_id: resp.user_id, user_user_id: resp.to_user };
        createNameSpace(ids, 'Im/');
        const payloadData =  Object.assign({}, resp);
        payloadData.user_name = payloadData.from_user_name
        webSocket.emitNewImToUser('User/' + resp.to_user, payloadData);
        resp.user_id = resp.to_user;
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.post("/createGroup", async (req, res) => {
    try {
        let resp = await service.createGroup(req.body);
        if (resp) {
            createNameSpace(resp.group_id, 'Groups/');
        }
        if (resp.members) {
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
        if (resp) {
            createNameSpace(resp.id, 'Groups/');
        }
        if (resp.members) {
            resp.members.forEach(member => {
                webSocket.emitNewGroupToUser('User/' + member, { group_id: resp.id, group_name: resp.groupName });
            });
        }
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.post("/sendThreadMessage", async (req, res) => {
    try {
        let resp = await service.sendThreadMessage(req.body);
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});

router.get("/getThreadMessage", async (req, res) => {
    try {
        let resp = await service.getThreadMessage(req.query);
        res.send(resp);
    } catch (err) {
        res.status(500).send({ error: err });
    }
});




module.exports = router;