"use strict"
const express = require('express');
const router = express.Router();
const service = require('./service');

router.put("/createDirectMessage", async (req, res) => {
    try {
        let resp = await service.createDirectMessage(req.query);
        res.send(resp);
    } catch (err) {
        res.status(500).send({error: err});
    }
});
router.post("/sendDirectMessage", async (req, res) => {
    try {
        let resp = await service.sendDirectMessage(req.body);
        res.send(resp);
    } catch (err) {
        res.status(500).send({error: err});
    }
});
router.get("/getMessageHistoryForUsers", async (req, res) => {
    try {
        let resp = await service.getImMessageForUsers(req.query);
        res.send(resp);
    } catch (err) {
        res.status(500).send({error: err});
    }
});

module.exports = router;