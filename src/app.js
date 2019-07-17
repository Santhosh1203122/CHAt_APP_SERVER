"use strict"
const express = require('express');
const app = express();
var bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
var cors = require('cors');
app.use(cors());
app.use('/api', require('./direct_message/router'));
app.use('/api', require('./group_message/router'));
app.use('/api', require('./initial_details/router'));
app.use(express.static('images'))

module.exports = app;

