const db = require('../db/db');
const path = require('path');

module.exports = {
    root: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            `
            SELECT 
                SIGN_CATEGORY.SIGN_CATEGORY_NAME,
                COUNT(SIGN.SIGN_NUM) AS total_signs,
                SUM(CASE 
                    WHEN LEARNING.USER_NUM = ? THEN 1
                    ELSE 0 
                END) AS learned_signs
            FROM SIGN_CATEGORY
            JOIN SIGN ON SIGN.SIGN_CATEGORY_NUM = SIGN_CATEGORY.SIGN_CATEGORY_NUM
            LEFT JOIN LEARNING ON SIGN.SIGN_NUM = LEARNING.SIGN_NUM
            GROUP BY SIGN_CATEGORY.SIGN_CATEGORY_NUM
            `,
            [user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching category data:", error);
                    return res.status(500).send("서버 오류");
                }
                
                res.status(200).json(results); // 결과를 클라이언트에 전송
            }
        );
    },

    category: (req, res) => {
        res.sendFile(path.join(__dirname, './front/build/index.html')); // 학습 메인 화면
    },

    signs: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            `SELECT SIGN_NUM, COUNT(*) AS count 
             FROM LEARNING 
             WHERE USER_NUM = ? 
             GROUP BY SIGN_CATEGORY_NUM`,
            [user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching learned signs:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 학습한 수어 목록 반환
            }
        );
    },

    list: (req, res) => {
        // 선택한 카테고리의 수어 목록을 가져옵니다.
        const { category_num } = req.params;

        db.query(
            `SELECT * FROM SIGN WHERE SIGN_CATEGORY_NUM = ?`,
            [category_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching signs list:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 카테고리별 수어 목록 반환
            }
        );
    },

    category_list: (req, res) => {
        db.query(
            `
            SELECT 
                SIGN_CATEGORY.SIGN_CATEGORY_NUM,
                SIGN_CATEGORY.SIGN_CATEGORY_NAME,
                COUNT(SIGN.SIGN_NUM) AS total_videos
            FROM SIGN_CATEGORY
            LEFT JOIN SIGN ON SIGN.SIGN_CATEGORY_NUM = SIGN_CATEGORY.SIGN_CATEGORY_NUM
            GROUP BY SIGN_CATEGORY.SIGN_CATEGORY_NUM, SIGN_CATEGORY.SIGN_CATEGORY_NAME
            `,
            (error, results) => {
                if (error) {
                    console.error("Error fetching category list:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 카테고리 목록을 클라이언트에 전송
            }
        );
    },
    
    learned: (req, res) => {
        // 학습했던 수어 목록을 가져옵니다.
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            `SELECT L.SIGN_NUM, COUNT(*) AS count 
             FROM LEARNING L 
             JOIN SIGNS S ON L.SIGN_NUM = S.SIGN_NUM 
             WHERE L.USER_NUM = ? 
             GROUP BY L.SIGN_NUM`,
            [user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching learned signs:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 학습한 수어 목록 반환
            }
        );
    },

    wrong: (req, res) => {
        // 틀렸던 수어 카테고리를 가져옵니다.
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            `SELECT L.SIGN_NUM, COUNT(*) AS wrong_count 
             FROM LEARNING L 
             JOIN SIGNS S ON L.SIGN_NUM = S.SIGN_NUM 
             WHERE L.USER_NUM = ? AND S.STATE = 'wrong'
             GROUP BY L.SIGN_NUM`,
            [user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching wrong signs:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 틀린 수어 목록 반환
            }
        );
    },
};
