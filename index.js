"use strict"
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

var server = app.listen(port, () => {
    console.log("server listening on", port);
});
var io = require('./src/Web-Socket/io').initialize(server);
var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
var cors = require('cors');
app.use(cors());
app.use('/api', require('./src/direct_message/router'));
app.use('/api', require('./src/group_message/router'));
app.use('/api', require('./src/common_details/router'));
app.use(express.static('images'))
