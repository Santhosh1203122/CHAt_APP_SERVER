"use strict"
const port = process.env.PORT || 3001;

var app = require('./app');

app.listen(port, () => {
    console.log("server listening on", port);
}); 
