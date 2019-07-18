var mysql = require('mysql2/promise');

const mysqlConfig = {
    host: 'localhost',
    user: 'root', // point out to the DB which you are using
    password: 'Sid_080615', // provide the password for the same
    database: 'chat_app'
}

module.exports = {
    createConnection: ()=> {
        return mysql.createConnection(mysqlConfig);
    }
}