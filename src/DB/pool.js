var mysql = require('mysql2/promise');
// mysql://b46ad1b134067f:2f11892a@us-cdbr-iron-east-02.cleardb.net/heroku_b55b0905485ee8f?reconnect=true
const mysqlConfig = {
    host: 'us-cdbr-iron-east-02.cleardb.net',
    user: 'b46ad1b134067f', // point out to the DB which you are using
    password: '2f11892a', // provide the password for the same
    database: 'heroku_b55b0905485ee8f'
}

module.exports = {
    createConnection: ()=> {
        return mysql.createConnection(mysqlConfig);
    }
}