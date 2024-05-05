// 4자리 인증 코드 생성 함수
function generateVerificationCode() {
    // 1000부터 9999 사이의 4자리 숫자를 랜덤으로 생성
    return Math.floor(1000 + Math.random() * 9000);
}

module.exports = {
    generateVerificationCode, // 여러 항목을 내보낼 수 있습니다.
};