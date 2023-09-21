const bcrypt = require('bcryptjs')
const userRepository = require('../repository/userRepository')
const User = require('../domain/model/user')
const sendMail = require('../utils/mailer')
const generatedOtp = require('../utils/otpGenerator')

const findHotels = async (req, res) => {
    try {
        const hotelsData = await userRepository.findAllHotels()
        console.log(hotelsData);
        if (!hotelsData) {
            const msg = "Something went wrong"
            return { status: 400, msg }
        }

        return hotelsData
    } catch (err) { console.log(err); }
}


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
    const { email } = userData
    console.log(otp, 'otp');
    sendMail(email, otp)
}

const otpAuth = async (req) => {
    const genOtp = req.session.otp
    console.log(req.body.otp);
    console.log(genOtp);
    if (req.body.otp === genOtp) {
        delete req.session.otp
        return { status: 200 }
    } else {
        const msg='Entered OTP is wrong'
        return { status: 400 ,msg}
    }
}


const userAuthentication = async (req) => {
    const userData=req.session.userFormData
    console.log(userData);
    try {
        const { first_name, last_name, email, mobile, password, confirm } = userData;

        const existingUserData = await userRepository.findUserByEmail(email);

        if (existingUserData) {
            console.log('User with this email already exists');
            const msg="User with this email already exists"
            return { status: 400,msg };
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
        delete req.session.userFormData
        if (newUser) {
            return { status: 200 }
        } else {
            const msg="Something went wrong"
            return { status: 400,msg };
        }

    } catch (error) {
        console.log(error);
        const msg="Some internal error"
        return { status: 500,msg };
    }
}
const verifyUser = async (userData) => {

    try {
        const { first_name, last_name, email, mobile, password, confirm } = userData;
        console.log(userData);
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
        console.log(user);
        if (user) {
            const msg = 'User already exists'
            return { status: 200, msg: msg }
        } else {
            const msg = ''
            return { status: 202, msg: msg }
        }

    } catch (error) { console.log(error); }
}

const userDetails= async (req)=>{
try{
    const email=req.session.user
    console.log(email);
    const userData= await userRepository.findUserByEmail(email)
    console.log(userData);
    if(userData)return userData
    else{
        const msg='Something went wrong'
        return {status:400,msg}
    }

}catch(err){console.log(err);}
}
const saveEditedUserName= async (req)=>{
    try{
        
    const updateData= await userRepository.findAndEditName(req)
    if( updateData ){
        const msg = "Name edited"
        return { status: 200, msg }
   
    } else{
        const msg = "Something went wrong"
        return { status: 500, msg }
   
    }
    }catch(err){console.log(err);}
}
const saveEditedUserEmail= async (req)=>{
    try{
        
    const updateData= await userRepository.findAndEditEmail(req)
    if( updateData ){
        const msg = "Email edited"
        return { status: 200, msg }
   
    } else{
        const msg = "Something went wrong"
        return { status: 500, msg }
   
    }
    }catch(err){console.log(err);}
}

const saveEditedUserMobile= async (req)=>{
    try{
        
    const updateData= await userRepository.findAndEditMobile(req)
    if( updateData ){
        const msg = "Phone number edited"
        return { status: 200, msg }
   
    } else{
        const msg = "Something went wrong"
        return { status: 500, msg }
   
    }
    }catch(err){console.log(err);}
}

const saveEditedUserGender= async (req)=>{
    try{
        
    const updateData= await userRepository.findAndEditGender(req)
    if( updateData ){
        const msg = "Gender added"
        return { status: 200, msg }
   
    } else{
        const msg = "Something went wrong"
        return { status: 500, msg }
   
    }
    }catch(err){console.log(err);}
}

const saveEditedUserAddress= async (req)=>{
    try{
        
    const updateData= await userRepository.findAndEditAddress(req)
    if( updateData ){
        const msg = "Address added"
        return { status: 200, msg }
   
    } else{
        const msg = "Something went wrong"
        return { status: 500, msg }
   
    }
    }catch(err){console.log(err);}
}

const generateOtpAndSendToVerifyEmail = (req) => {
    const otp = generatedOtp()
    req.session.otp = otp
    console.log(req.session.otp +"@@@####");

    const email = req.session.user
    console.log(otp, 'otp');
    sendMail(email, otp)
}

const saveEditedUserPassword= async (req)=>{
    try{
        console.log(req);
        const genOtp = req.session.otp
        console.log(req.body.otp +'#####');
        console.log(genOtp +"@@@@2");
        if (req.body.otp === genOtp) {
            

            const updateData= await userRepository.findAndEditPassword(req)
            if( updateData ){
                const msg = "New password added"
                delete req.session.otp
                return { status: 200, msg }
           
            } else{
                const msg = "Something went wrong"
                return { status: 500, msg }
           
            }

        } else {
            const msg='Entered OTP is wrong'
            return { status: 400 ,msg}
        }
        
   
    }catch(err){console.log(err);}
}
module.exports = {
    userAuthentication,
    verifyUser,
    generateOtpAndSend,
    auth,
    otpAuth,
    findHotels,
    userDetails,
    saveEditedUserName,
    saveEditedUserEmail,
    saveEditedUserMobile,
    saveEditedUserGender,
    saveEditedUserAddress,
    generateOtpAndSendToVerifyEmail,
    saveEditedUserPassword
}