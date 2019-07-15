"use strict"
const port = process.env.PORT || 3001;

var app = require('./src/app');
app.listen(port, () => {
    console.log("server listening on", port);
}); 