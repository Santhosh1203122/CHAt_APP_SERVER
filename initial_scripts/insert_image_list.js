let mysql = require('mysql');
// let videoList = require('./models/vide_list');

let connection = mysql.createConnection({
    host: 'localhost',
    user: '',// database username
    password: '', // database password
    database: 'video_app'
});

const videoList = [
	[
		0,
		"http://localhost:3000/empty.jpg"
	],
	[
		1,
		"http://localhost:3000/poster1.jpg"
	],
	[
		2,
		"http://localhost:3000/poster2.jpg"
	],
	[
		3,
		"http://localhost:3000/poster3.jpg"
	],
	[
		4,
		"http://localhost:3000/poster4.jpg"
	],
	[
		5,
		"http://localhost:3000/poster5.jpg"
	],
	[
		6,
		"http://localhost:3000/poster6.jpg"
	],
	[
		7,
		"http://localhost:3000/poster7.jpg"
	],
	[
		8,
		"http://localhost:3000/poster8.jpg"
	],
	[
		9,
		"http://localhost:3000/poster9.jpg"
    ]
];
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    let createTodos = 'INSERT INTO image_holder (id, image_url) VALUES ?';

    connection.query(createTodos, [videoList], function (err, results, fields) {
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

