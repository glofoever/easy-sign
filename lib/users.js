const db = require('../db/db');
const path = require('path');

//잔디 구현 쿼리문
glass_query = `SELECT
  date_index.date,
  IFNULL(learning_count.learning_count, 0) AS learning_count,
  IFNULL(quiz_count.quiz_count, 0) AS quiz_count
FROM
  (
    SELECT DATE_ADD(CURDATE(), INTERVAL -n.number DAY) AS date
    FROM (SELECT 0 AS number UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
          SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL
          SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL
          SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL
          SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL
          SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27) AS n
  ) AS date_index
LEFT JOIN
  (SELECT DATE(LEARNING_DATE) AS date, COUNT(*) AS learning_count
   FROM LEARNING
   WHERE LEARNING_DATE >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
   GROUP BY DATE(LEARNING_DATE)
  ) AS learning_count
ON date_index.date = learning_count.date
LEFT JOIN
  (SELECT DATE(QUIZ_DATE) AS date, COUNT(*) AS quiz_count
   FROM QUIZ
   WHERE QUIZ_DATE >= DATE_SUB(CURDATE(), INTERVAL 28 DAY)
   GROUP BY DATE(QUIZ_DATE)
  ) AS quiz_count
ON date_index.date = quiz_count.date
ORDER BY date_index.date;
`


module.exports = {
    mypage: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }
        
        res.sendFile(path.join(__dirname, './front/build/index.html')); // 마이페이지
    },

    friends: (req, res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            "SELECT * FROM friend WHERE (user1_num = ? OR user2_num = ?) AND state = 'accept'",
            [user_num, user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching friends:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 친구 목록 반환
            }
        );
    },

    // friends_info: (req, res) => {
    //     if (!req.session.is_logined) {
    //         return res.status(401).send("로그인이 필요합니다.");
    //     }

    //     const { friends_id } = req.params;

    //     db.query(
    //         "SELECT * FROM friend WHERE friend_id = ?",
    //         [friends_id],
    //         (error, results) => {
    //             if (error) {
    //                 console.error("Error fetching friend info:", error);
    //                 return res.status(500).send("서버 오류");
    //             }

    //             if (results.length > 0) {
    //                 res.status(200).json(results[0]); // 친구 정보 반환
    //             } else {
    //                 res.status(404).send("친구 정보를 찾을 수 없습니다.");
    //             }
    //         }
    //     );
    // },

    friends_delete: (req, res) => {
        // 친구 삭제
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const { friends_id } = req.params;

        db.query(
            "DELETE FROM friend WHERE friend_id = ?",
            [friends_id],
            (error, results) => {
                if (error) {
                    console.error("Error deleting friend:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).send("친구가 삭제되었습니다.");
            }
        );
    },

    friends_req: (req, res) => {
        // 친구 요청 목록
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            "SELECT * FROM friend WHERE user1_num = ? AND state = 'request'",
            [user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching friend requests:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 친구 요청 목록 반환
            }
        );
    },

    friends_req_process: (req, res) => {
        // 친구 요청 전송
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user1_num = req.session.user_num;
        const { user2_id } = req.body; // 요청 대상 친구 번호
        
        db.query('SELECT USER_NUM FROM USER WHERE USER_ID=?',[user2_id], (err, result) => {
            
            console.log(req.body)
            db.query(
                "INSERT INTO friend (USER1_NUM, USER2_NUM, STATE) VALUES (?, ?, 'request')",
                [user1_num, result[0].USER_NUM],
                (error, results) => {
                    if (error) {
                        console.error("Error sending friend request:", error);
                        return res.status(500).send("서버 오류");
                    }

                    res.status(200).send("친구 요청이 성공적으로 전송되었습니다.");
                }
            );  
        })
    },

    friends_req_delete: (req, res) => {
        // 친구 요청을 취소
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;
        const { friends_id } = req.params;

        db.query(
            "DELETE FROM friends WHERE friend_id = ? AND user1_num = ? AND state = 'request'",
            [friends_id, user_num],
            (error, results) => {
                if (error) {
                    console.error("Error deleting friend request:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).send("친구 요청이 취소되었습니다.");
            }
        );
    },

    friends_accept: (req, res) => {
        // 사용자가 받은 친구 요청 목록
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const user_num = req.session.user_num;

        db.query(
            "SELECT * FROM friends WHERE user2_num = ? AND state = 'request'",
            [user_num],
            (error, results) => {
                if (error) {
                    console.error("Error fetching received friend requests:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).json(results); // 받은 친구 요청 목록 반환
            }
        );
    },

    friends_accept_process: (req, res) => {
        // 친구 요청을 수락
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const { friend_id } = req.body;

        db.query(
            "UPDATE friends SET state = 'accept' WHERE friend_id = ?",
            [friend_id],
            (error, results) => {
                if (error) {
                    console.error("Error accepting friend request:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).send("친구 요청이 성공적으로 수락되었습니다.");
            }
        );
    },

    friends_refuse: (req, res) => {
        // 친구 요청을 거절
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }

        const { friend_id } = req.body;

        db.query(
            "UPDATE friends SET state = 'refuse' WHERE friend_id = ?",
            [friend_id],
            (error, results) => {
                if (error) {
                    console.error("Error refusing friend request:", error);
                    return res.status(500).send("서버 오류");
                }

                res.status(200).send("친구 요청이 거절되었습니다.");
            }
        );
    },
};
