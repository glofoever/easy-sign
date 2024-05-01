var db = require('mysql2');

var db = db.createConnection({
    host     : 'localhost',
    user     : 'dbid241',
    port     : 3306,
    password : 'dbpass241',
    database : 'db24110',
    multipleStatements: true,
    connectTimeout: 10000  // 연결 타임아웃 (밀리초)
})
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Database connected successfully.');
});

module.exports = db;