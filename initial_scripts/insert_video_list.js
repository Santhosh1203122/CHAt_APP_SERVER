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
      'The Birds', 1
    ],
    [
      'Rear Window', 2
    ],
    [
      'Family Pot', 3
    ],
    [
      'Family Pot', 2
    ],
    [
      'Rear Window', 1
    ],
    [
      'The Birds', 3
    ],
    [
      'Rear Window', 3
    ],
    [
      'The Birds', 2
    ],
    [
      'Family Pot', 1
    ],
    [
      'The Birds', 1
    ],
    [
      'The Birds', 1
    ],
    [
      'Rear Window', 2
    ],
    [
      'Family Pot', 3
    ],
    [
      'Family Pot', 2
    ],
    [
      'Rear Window', 1
    ],
    [
      'The Birds', 3
    ],
    [
      'Rear Window', 3
    ],
    [
      'The Birds', 2
    ],
    [
      'Family Pot', 1
    ],
    [
      'The Birds', 1
    ],
    [
      'Rear Window', 5
    ],
    [
      'Family Pot', 6
    ],
    [
      'Family Pot', 5
    ],
    [
      'Rear Window', 4
    ],
    [
      'The Birds', 6
    ],
    [
      'Rear Window',6
    ],
    [
      'The Birds', 5
    ],
    [
      'Family Pot', 4
    ],
    [
      'The Birds', 4
    ],
    [
      'Rear Window', 5
    ],
    [
      'Rear Window', 5
    ],
    [
      'Family Pot',6
    ],
    [
      'Family Pot', 5
    ],
    [
      'Rear Window', 4
    ],
    [
      'The Birds',6
    ],
    [
      'Rear Window',6
    ],
    [
      'The Birds', 5
    ],
    [
      'Family Pot', 4
    ],
    [
      'The Birds', 4
    ],
    [
      'Rear Window', 5
    ],
    [
      'Family Pot', 9
    ],
    [
      'Family Pot', 8
    ],
    [
      'Rear Window', 7
    ],
    [
      'The Birds', 9
    ],
    [
      'Rear Window', 9
    ],
    [
      'The Birds', 8
    ],
    [
      'Family Pot', 7
    ],
    [
      'Family Pot', 9
    ],
    [
      'Family Pot', 8
    ],
    [
      'Rear Window', 7
    ],
    [
      'The Birds with an Extra Long Title', 9
    ],
    [
      'Rear Window', 9
    ],
    [
      'The Birds', 8
    ],
    [
      'Family Pot', null
    ]
  ];
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    let createTodos = 'INSERT INTO video_list (name, poster_image_id) VALUES ?';

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

