const db = require("../db/db");
const path = require("path");

module.exports = {
    // 문의 작성 페이지 로드
    write: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        res.sendFile(path.join(__dirname, "../front/build/index.html")); // 문의 작성 페이지 로드
    },

    // 문의 작성
    write_process: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const { qna_title, qna_content, qna_attached, qna_category_num } = req.body;
        const user_num = req.session.user_num;

        db.query(
            "INSERT INTO QNA (USER_NUM, QNA_CATEGORY_NUM, DATE_NUM, QNA_TITLE, QNA_CONTENT, QNA_ATTACHED) VALUES (?, ?, (SELECT DATE_NUM FROM date_index WHERE date = CURDATE()), ?, ?, ?)",
            [user_num, qna_category_num, qna_title, qna_content, qna_attached],
            (error, results) => {
                if (error) {
                    console.error("Error inserting QNA:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(201).send("문의가 성공적으로 작성되었습니다.");
            }
        );
    },

    // 문의 수정
    write_update: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const { qna_num, qna_title, qna_content, qna_attached, qna_category_num } = req.body;
        const user_num = req.session.user_num;

        // 수정할 문의가 존재하는지 확인
        db.query(
            "SELECT * FROM QNA WHERE QNA_NUM = ? AND USER_NUM = ?",
            [qna_num, user_num],
            (error, results) => {
                if (error) {
                    console.error("Error finding QNA:", error);
                    return res.status(500).send("서버 오류");
                }

                if (results.length === 0) {
                    return res.status(404).send("수정할 문의를 찾을 수 없습니다.");
                }

                // 문의 수정
                db.query(
                    "UPDATE QNA SET QNA_CATEGORY_NUM = ?, QNA_TITLE = ?, QNA_CONTENT = ?, QNA_ATTACHED = ? WHERE QNA_NUM = ?",
                    [qna_category_num, qna_title, qna_content, qna_attached, qna_num],
                    (updateError, updateResults) => {
                        if (updateError) {
                            console.error("Error updating QNA:", updateError);
                            return res.status(500).send("서버 오류");
                        }

                        res.status(200).send("문의가 성공적으로 수정되었습니다.");
                    }
                );
            }
        );
    },
    
    // 문의 목록 조회
    list: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            "SELECT * FROM QNA WHERE USER_NUM = ?",
            [user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching QNA list:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 문의 목록 반환
            }
        );
    },

    // 특정 문의 조회
    view: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const { qna_num } = req.params;

        db.query(
            "SELECT * FROM QNA WHERE QNA_NUM = ?",
            [qna_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching QNA:", error);
                    return res.status(500).send("서버 오류");
                }

                if (results.length > 0) {
                    res.status(200).json(results[0]); // 문의 정보 반환
                } else {
                    res.status(404).send("해당 문의를 찾을 수 없습니다.");
                }
            }
        );
    },

    // 문의 삭제
    delete: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const { qna_num } = req.params;

        db.query(
            "DELETE FROM QNA WHERE QNA_NUM = ?",
            [qna_num],
            (error, results) => {
                if (error) {
                    console.error("Error deleting QNA:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).send("문의가 성공적으로 삭제되었습니다.");
            }
        );
    },
};
