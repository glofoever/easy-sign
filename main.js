const nodemailer = require('nodemailer');
const express = require('express')
const session = require('express-session')
const path = require('path');
const app = express();
const readline = require('readline');
const port = 60010
const Math = require('math');
const db = require('./db/db');
const sessionOption = require('./db/sessionOption');
const bodyParser = require("body-parser");
// const bcrypt = require('bcrypt');

// 이메일 인증 관련
const smtpTransport = require('./config/email.js');
//
const crypto = require('crypto');
const cors = require("cors")

// py 백그라운드 실행 (모델 불러오기)
const { spawn } = require('child_process');


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
app.use('/video', express.static(path.join(__dirname,'../../sign_video')))

app.use('/users',usersRouter);
app.use('/users/sign',signRouter);
app.use('/userManagements',userManagementRouter);
app.use('/users/qna',qnaRouter);



// function loadAIModel() {
// 	const pythonScriptPath = 'py_files/jihun_test.py';
// 	exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
// 	  if (error) {
// 		console.error(`Error while executing Python script: ${error.message}`);
// 		return;
// 	  }
// 	  if (stderr) {
// 		console.error(`Standard Error output from Python script: ${stderr}`);
// 		return;
// 	  }
// 	  console.log(`Python script output: ${stdout}`);
// 	});
//   }

  
app.get('/', (req, res) => {    
    req.sendFile(path.join(__dirname, './front/build/index.html'));
})

// Python 프로세스를 백그라운드에서 실행
// const pythonProcess = spawn('python', ['./ai/py_files/test2.py']);

// // Python 프로세스의 표준 출력(stdout)과 표준 오류(stderr)을 콘솔에 출력
// pythonProcess.stdout.on('data', (data) => {
// 	console.log(`Python stdout: ${data.toString().trim()}`);
//   });
  
//   pythonProcess.stderr.on('data', (data) => {
// 	console.error(`Python stderr: ${data.toString().trim()}`);
//   });
  
//   pythonProcess.on('close', (code) => {
// 	console.log(`Python process exited with code ${code}`);
//   });
  
// // 콘솔 입력을 받기 위한 인터페이스
// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
//   });
  
// rl.on('line', (input) => {
// // 입력을 Python 프로세스에 전달
// pythonProcess.stdin.write(input + '\n');
// });

// app.post('/predict', (req, res) => {
// 	const jsonFolderPath = req.body.jsonFolderPath;
  
// 	let output = '';
// 	pythonProcess.stdout.once('data', (data) => {
// 	  output += data.toString();
// 	});
  
// 	pythonProcess.stdin.write(jsonFolderPath + '\n');
  
// 	pythonProcess.stdout.once('data', () => {
// 	  res.send(output);
// 	});
//   });

app.listen(port, () => {
    console.log(`Example app listening at http://ceprj.gachon.ac.kr:${port}`)
})