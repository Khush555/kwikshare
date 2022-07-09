const nodemailer = require('nodemailer');

module.exports=async ({ from, to, subject, text, html}) => {
    let transporter= nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        secure: false,
        auth: {
            user: 'wasnikkhush@gmail.com',
            pass: 'BFLxj0ZQKOtzwH7m'
        }
    });
    let info =await transporter.sendMail({
        from : `Sharefile <${from}>`,
        to,
        subject,
        text,
        html
    })
}
