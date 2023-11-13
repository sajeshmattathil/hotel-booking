const nodemailer = require('nodemailer');

const sendOTPByEmail = (email,otp) => {
    console.log(email,otp,"********")
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'74123loo@gmail.com',
            pass: 'ofnmcnwftggwqith'
        }
    });

    let msg=`Dear user  OTP to reset your Travel nest login  is  ${otp}.Do not share this to any one`

    let mailDetails = {
        from: '74123loo@gmail.com',
     	to: email,
        subject: 'Trave Nest',
        text: msg
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
