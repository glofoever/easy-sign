const express = require('express');
const router = express.Router();
const sign = require('../lib/sign');

// 수어 학습 메인 페이지
router.get("/", (req, res) => {
    sign.root(req, res); // 수어 학습 메인 페이지 로드
});

// 수어 학습 페이지
router.get("/learn", (req, res) => {
    sign.category(req, res); // 학습 카테고리 목록
});

// 수어 학습 카테고리 목록
router.get("/learn/category", (req, res) => {
    sign.category_list(req, res); // 학습 카테고리 목록
});

// 선택한 카테고리의 수어 목록
router.get("/learn/category/:category_num", (req, res) => {
    sign.list(req, res); // 선택한 카테고리의 수어 목록
});

// 학습한 수어 목록
router.get("/learn/learned", (req, res) => {
    sign.learned(req, res); // 학습한 수어 목록
});

// 틀린 수어 목록
router.get("/learn/wrong", (req, res) => {
    sign.wrong(req, res); // 틀린 수어 목록
});

// 특정 수어 학습 페이지
router.get("/learn/view/:sign_num", (req, res) => {
    sign.signs(req, res); // 선택한 수어 학습 페이지
});

module.exports = router;
