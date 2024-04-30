const nodemailer = require('nodemailer');
const express = require('express')
const session = require('express-session')
const path = require('path');
const app = express()
const port = 3002
const Math = require('math');
// const smtpTransport = require('./config/email');
const db = require('./db/db');
const sessionOption = require('./db/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
app.use(session({  
	key: 'session_cookie_name',
    secret: '~',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}))


var usersRouter = require('./router/usersRouter');
var userManagementRouter = require('./router/userManagementRouter');
var signRouter = require('./router/signRouter');
var qnaRouter = require('./router/qnaRouter');

app.use(express.static(path.join(__dirname, './front/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users',usersRouter);
app.use('/users/sign',signRouter);
app.use('/userManagements',userManagementRouter);
app.use('/users/qna',qnaRouter);


app.get('/', (req, res) => {    
    req.sendFile(path.join(__dirname, './front/build/index.html'));
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})