const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'easysign2024@naver.com',
        pass: 'tnqektndj##33',
    }, 
    tls: {
        rejectUnauthorized: false,
    },
});

module.exports = smtpTransport; // 'module.exports'로 내보냄