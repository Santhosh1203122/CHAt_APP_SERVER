let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: '',// database username
    password: '', // database password
    database: 'video_app'
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    let createTodos = `CREATE TABLE video_app.video_list (
        name VARCHAR(250) NOT NULL,
        poster_image_id INT )`;

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

