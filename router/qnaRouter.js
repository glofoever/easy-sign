const express = require("express");
const router = express.Router();
const qna = require("../lib/qna");

// 문의 작성 페이지 로드
router.get("/write", (req, res) => {
    qna.write(req, res);
});

// 문의 작성
router.post("/write", (req, res) => {
    qna.write_process(req, res);
});

// 문의 수정
router.put("/write", (req, res) => {
    qna.write_update(req, res); // 문의 수정
});

// 문의 목록 조회
router.get("/list", (req, res) => {
    qna.list(req, res);
});

// 특정 문의 조회
router.get("/:qna_num", (req, res) => {
    qna.view(req, res);
});

// 문의 삭제
router.delete("/:qna_num", (req, res) => {
    qna.delete(req, res);
});

module.exports = router;
