let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',// database username
    password: '',// database password
    database: 'video_app'
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    let createTodos = `CREATE TABLE if not exists video_app.image_holder(
        id INT NOT NULL,
        image_url VARCHAR(250),
        PRIMARY KEY(id))`;

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

