//201935211 구지훈

var options = {
    host     : 'localhost',
    user     : 'root',
    port     : 1031,
    password : '1031',
    database : 'easy_sign',
    clearExpired : true ,             // 만료된 세션 자동 확인 및 지우기 여부
    checkExpirationInterval: 10000,   // 만료된 세션이 지워지는 빈도 (milliseconds)
    expiration: 1000*60*60*2,         // 유효한 세션의 최대 기간 2시간으로 설정 (milliseconds) 
};


module.exports = options;