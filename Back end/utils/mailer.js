const otpGenerator=require('../utils/otpGenerator')
const nodemailer = require('nodemailer');




const sendOTPByEmail = (email,otp) => {
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'74123loo@gmail.com',
            pass: 'ofnmcnwftggwqith'
        }
    });

    let mailDetails = {
        from: '74123loo@gmail.com',
     	to: email,
        subject: 'OTP',
        text: otp
    };

    mailTransporter.sendMail(mailDetails, (error, data) => {
        if (error) {
            console.log("Error:", error);
        } else {
            console.log("Mail sent");
        }
    });
}



module.exports = sendOTPByEmail;
