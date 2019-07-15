"use strict"
const express = require('express');
const router = express.Router();
const service = require('./service');


router.post("/createGroup", async (req, res) => {
    try {
        let resp = await service.createGroup(req.body);
        res.send(resp);
    } catch (err) {
        res.status(500).send({error: err});
    }
});
router.get("/getMessageHistoryForGroup", async (req, res) => {
    try {
        let resp = await service.getMessageForGroup(req.query);
        res.send(resp);
    } catch (err) {
        res.status(500).send({error: err});
    }
});
router.post("/sendGroupMessage", async (req, res) => {
    try {
        let resp = await service.sendGroupMessage(req.body);
        res.send(resp);
    } catch (err) {
        res.status(500).send({error: err});
    }
});

module.exports = router;