
let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: '', // database username
    password: '', // database password
    database: ''
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    let createTodos = `CREATE SCHEMA video_app`;

    connection.query(createTodos, function (err, results, fields) {
        if (err) {
            console.log(err.message);
        }
    });

    connection.end(function (err) {
        if (err) {
            return console.log(err.message);
        }
    });
});

