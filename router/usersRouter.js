const express = require('express');
var router = express.Router()
var users = require('../lib/users');

router.get('/mypage', (req, res) => {
    users.mypage(req, res);
});

router.get('/mypage/friends', (req, res) => {
    users.friends(req, res);
});

// router.get('/mypage/friends/:friends_id', (req, res) => {
//     users.friends_info(req, res);
// });

router.delete('/mypage/friends/:friends_id', (req, res) => {
    users.friends_delete(req, res);
});

router.get('/mypage/friends/request', (req, res) => {
    users.friends_req(req, res);
});

router.post('/mypage/friends/request', (req, res) => {
    users.friends_req_process(req, res);
});

router.delete('/mypage/friends/request', (req, res) => {
    users.friends_req_delete(req, res);
});

router.get('/mypage/friends/accept', (req, res) => {
    users.friends_accept(req, res);
});

router.post('/mypage/friends/accept', (req, res) => {
    users.friends_accept_process(req, res);
});

router.put('/mypage/friends/accept', (req, res) => {
    users.friends_refuse(req, res);
});


module.exports = router;