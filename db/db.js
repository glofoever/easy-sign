var db = require('mysql2');

var db = db.createConnection({
    host     : 'localhost',
    user     : 'root',
    port     : 1031,
    password : '1031',
    database : 'easy_sign'   
})
db.connect();

module.exports = db;