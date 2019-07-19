var mysql = require('mysql2/promise');
// mysql://b46ad1b134067f:2f11892a@us-cdbr-iron-east-02.cleardb.net/heroku_b55b0905485ee8f?reconnect=true
const mysqlConfig = {
    host: 'otmaa16c1i9nwrek.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'gcsgt9ttu4riqvpt', // point out to the DB which you are using
    password: 'zbs4ivpah09o727u', // provide the password for the same
    database: 'izifjivadvjuhvfh'
}

module.exports = {
    createConnection: ()=> {
        return mysql.createConnection(mysqlConfig);
    }
}