const express = require('express');
var router = express.Router()
var userManagements = require('../lib/userManagements');


router.post("/login", (req, res) => { // 데이터 받아서 결과 전송
    userManagements.login_process(req, res);
});

router.get('/logout', (req, res) => {
    userManagements.logout(req, res);
});


router.post('/signup', (req, res) => {
    userManagements.signup_process(req, res);
});

router.get('/userInfo', (req, res) => {
    userManagements.userInfo(req, res);
});

router.get('/findId', (req, res) => {
    userManagements.findId(req, res);
});

router.post('/findId', (req, res) => {
    userManagements.findId_process(req, res);
});

router.get('/findPw', (req, res) => {
    userManagements.findPw(req, res);
});

router.post('/findPw', (req, res) => {
    userManagements.findPw_process(req, res);
});

module.exports = router;