"use strict"
const express = require('express');
const router = express.Router();
const service = require('./service');

router.get("/getInitialDetails", async (req, res) => {
    try {
        let resp = await service.getUserInitialDetails(req.query);
        res.send(resp);
    } catch (err) {
        res.status(500).send({error: err});
    }
});

module.exports = router;