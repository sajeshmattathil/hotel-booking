const bcrypt = require('bcryptjs')
const userRepository = require('../repository/userRepository')
const User = require('../domain/model/user')
const sendMail = require('../utils/mailer')
const generatedOtp = require('../utils/otpGenerator')


const auth = async (req) => {
    try {
        console.log(req.body);
        const { email, password } = req.body
        if (!email && !password) {
            const msg = 'email or password is missing'
            return { status: 403, msg: msg }
        }

        const user = await userRepository.findUserByEmail(email)
        console.log(user);
        if (!user) {
            const msg = 'No user exists'
            return { status: 400, msg: msg }
        }
        const checkedPassword = await bcrypt.compare(password, user.password)

        if (user && checkedPassword) {
            if (user.isUser) {
                req.session.user = email;
                return { status: 200 }
            }
        }
        else if (!user) {
            const msg = 'No user exists'
            return { status: 400, msg: msg }
        }
        else {
            const msg = 'Password is incorrect'
            return { status: 400, msg: msg }
        }
    } catch (error) {
        console.log(error);
    }
}


const generateOtpAndSend = (req) => {
    const otp = generatedOtp()
    req.session.otp = otp
    const userData = req.session.userFormData
    const email = userData.email
    console.log(otp, 'otp');
    sendMail(email, otp)
}

const otpAuth = async (req) => {
    const genOtp = req.session.otp
    console.log(req.body.otp);
    console.log(genOtp);
    if (req.body.otp === genOtp) {
        return { status: 200 }
    } else {
        return { status: 400 }
    }
}


const userAuthentication = async (userData) => {
    console.log(userData);
    try {
        const existingUserData = await userRepository.findUserByEmail(email);

        if (existingUserData) {
            console.log('User with this email already exists');
            return { status: 400 };
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            first_name,
            last_name,
            email,
            mobile,
            password: hashPassword
        });
        newUser.save()

        if (newUser) {
            return { status: 200 }
        } else {
            return { status: 400 };
        }

    } catch (error) {
        console.log(error);
        return { status: 500 };
    }
}
const verifyUser = async (userData) => {

    try {
        const { first_name, last_name, email, mobile, password, confirm } = userData;

        if (!first_name || !last_name || !email || !mobile || !password || !confirm) {
            console.log('Fill in empty fields');
            const msg = 'Fill in empty fields'
            return { status: 400, msg: msg };
        }

        // Confirm password
        if (password !== confirm) {
            console.log('Passwords must match');
            const msg = 'Passwords must match'
            return { status: 400, msg: msg };
        }
        const user = await userRepository.findUserByEmail(email)
        if (user) {

            const msg = 'User already exists'
            return { status: 200, msg: msg }
        }
    } catch (error) { console.log(error); }
}


module.exports = {
    userAuthentication,
    verifyUser,
    generateOtpAndSend,
    auth,
    otpAuth
}