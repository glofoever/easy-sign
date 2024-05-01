const db = require('../db/db');
const path = require('path');

module.exports = {
    // login: (req,res) => {
    //     req.sendFile(path.join(__dirname, './front/build/index.html'));
    // },

    login_process: (req,res) => {
        const user_id = req.body.user_id;
        const user_passwd = req.body.user_passwd;
        const sendData = { isLogin: "" };

        if (user_id && user_passwd) {             // id와 pw가 입력되었는지 확인
            db.query('SELECT * FROM USER WHERE USER_ID = ?', [user_id], function (error, results, fields) {
                if (error) throw error;
                console.log(results[0].USER_PASSWD)
                console.log(user_passwd)
                if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      

                    if (user_passwd === results[0].USER_PASSWD) {                  // 비밀번호가 일치하면
                        req.session.is_logined = true;      // 세션 정보 갱신
                        req.session.user_id = user_id;
                        req.session.user_num = results[0].USER_NUM;
                        req.session.save(function () {
                            sendData.isLogin = "True"
                            res.send(sendData);
                        });
                        db.query(`INSERT INTO logTable (created, user_id, action, command, actiondetail) VALUES (NOW(), ?, 'login' , ?, ?)`
                            , [req.session.nickname, '-', `로그인 테스트`], function (error, result) { });
                    }
                    else{                                   // 비밀번호가 다른 경우
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.send(sendData);
                    }
                                        
                } else {    // db에 해당 아이디가 없는 경우
                    sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                    res.send(sendData);
                }
            });
        } else {            // 아이디, 비밀번호 중 입력되지 않 은 값이 있는 경우
            sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
            res.send(sendData);
        }
    },

    logout: (req,res) => {
        const sendData = { result: "" };
        req.session.destroy(function (err) {
            sendData.result = "logout success"
            res.send(sendData);
            if(err) {
                sendData.result = "logout failed"
            }
        });
    },

    signup: (req,res) => {
        req.sendFile(path.join(__dirname, './front/build/index.html'));
    },

    signup_process: (req,res) => {
        const user_id = req.body.user_id;
        const user_passwd = req.body.user_passwd;
        const user_name = req.body.user_name;
        const user_birth = req.body.user_birth;
        const user_email = req.body.user_email;
        
        const sendData = { isSuccess: "" };

        if (user_id && user_passwd) {
            db.query('SELECT * FROM USER WHERE USER_ID = ?', [user_id], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
                if (error) throw error;
                if (results.length <= 0) {         // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
                    // const haseduser_passwd = bcrypt.hashSync(user_passwd, 10);    // 입력된 비밀번호를 해시한 값
                    db.query('INSERT INTO USER (USER_ID, USER_PASSWD, USER_NAME, USER_BIRTH, USER_EMAIL) VALUES(?,?,?,?,?)', 
                    [user_id, user_passwd, user_name, user_birth, user_email], function (error, data) {
                        if (error) throw error;
                        req.session.save(function () {                        
                            sendData.isSuccess = "True"
                            res.send(sendData);
                        });
                    });
                }
                else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우            
                    sendData.isSuccess = "이미 존재하는 아이디 입니다!"
                    res.send(sendData);  
                }            
            });        
        } else {
            sendData.isSuccess = "아이디와 비밀번호를 입력하세요!"
            res.send(sendData);  
        }
    },
    
    userInfo: (req,res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }
    
        db.query(
            "SELECT * FROM USER WHERE USER_ID = ?",
            [req.session.user_id],
            (error, results) => {
                if (error) {
                    console.error("Error retrieving user info:", error);
                    return res.status(500).send("서버 오류");
                }
    
                if (results.length > 0) {
                    res.status(200).json(results[0]); // 사용자 정보 반환
                } else {
                    res.status(404).send("사용자를 찾을 수 없습니다.");
                }
            }
        );
    },

    infoChange: (req,res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }
    
        // 수정 페이지 로드
        res.sendFile(path.join(__dirname, './front/build/index.html'));
    },

    infoChange_process: (req,res) => {
        if (!req.session.is_logined) {
            return res.status(401).send("로그인이 필요합니다.");
        }
    
        const { user_name, user_email, user_birth } = req.body;
    
        if (!user_name || !user_email) {
            return res.status(400).send("이름과 이메일은 필수입니다.");
        }
    
        db.query(
            "UPDATE USER SET USER_NAME = ?, USER_EMAIL = ?, USER_BIRTH = ? WHERE USER_ID = ?",
            [user_name, user_email, user_birth, req.session.nickname],
            (error, results) => {
                if (error) {
                    console.error("Error updating user info:", error);
                    return res.status(500).send("서버 오류");
                }
    
                res.status(200).send("개인 정보가 성공적으로 변경되었습니다.");
            }
        );
    },

    findId: (req,res) => {
        res.sendFile(path.join(__dirname, './front/build/index.html'));
    },

    findId_process: (req, res) => {
        const { user_email } = req.body;
    
        if (!user_email) {
            return res.status(400).send("이메일이 필요합니다.");
        }
    
        db.query(
            "SELECT USER_ID FROM USER WHERE USER_EMAIL = ?",
            [user_email],
            (error, results) => {
                if (error) {
                    console.error("Error finding user id:", error);
                    return res.status(500).send("서버 오류");
                }
    
                if (results.length > 0) {
                    res.status(200).json({ user_id: results[0].user_id }); // 찾은 아이디 반환
                } else {
                    res.status(404).send("해당 이메일로 등록된 아이디가 없습니다.");
                }
            }
        );
    },
    
    findPw: (req, res) => {
        res.sendFile(path.join(__dirname, './front/build/index.html')); // 비밀번호 찾기 페이지 로드
    },
    

    findPw_process: (req, res) => {
        const { user_id, user_email } = req.body;
    
        if (!user_id || !user_email) {
            return res.status(400).send("아이디와 이메일이 필요합니다.");
        }
    
        db.query(
            "SELECT * FROM USER WHERE USER_ID = ? AND USER_EMAIL = ?",
            [user_id, user_email],
            (error, results) => {
                if (error) {
                    console.error("Error finding password:", error);
                    return res.status(500).send("서버 오류");
                }
    
                if (results.length > 0) {
                    // 임시 비밀번호 생성 및 이메일 발송 로직을 구현해야 함...
                    res.status(200).send("비밀번호 재설정 링크가 이메일로 발송되었습니다.");
                } else {
                    res.status(404).send("아이디 또는 이메일 정보가 일치하지 않습니다.");
                }
            }
        );
    },
    
}