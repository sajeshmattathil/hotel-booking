const bcrypt = require('bcryptjs')
const userRepository = require('../repository/userRepository')
const User = require('../domain/model/user')
const sendMail = require('../utils/mailer')
const generatedOtp = require('../utils/otpGenerator')

const findHotels = async (req) => {
    try {
        const cityName=req.body.city  
        console.log(req.body);
        if(req.session.city){
            const city= req.session.city
            const hotelsData = await userRepository.findAllHotels(city)
        if (hotelsData.length === 0) {
            const msg = "Something went wrong"
            return { status: 400, msg }
        }

        return hotelsData
        }
        req.session.city=cityName
        const hotelsData = await userRepository.findAllHotels(cityName)
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
       // delete req.session.otp
        return { status: 200 }
    } else {
        const msg='Entered OTP is wrong'
        return { status: 400 ,msg}
    }
}


const userAuthentication = async (req) => {
    const userData=req.session.userFormData
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
        } else {
            const msg = ''
            return { status: 202, msg: msg }
        }

    } catch (error) { console.log(error); }
}

const userDetails= async (req)=>{
try{
    const email=req.session.user
    const userData= await userRepository.findUserByEmail(email)
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
        console.log(req.session.otp+"000000");
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

// const generateOtpAndSendToVerifyEmail = (req,res) => {
//     const otp = generatedOtp()
//     req.session.otp = otp
//     const email = req.session.user
//     console.log(otp, 'otpNew');
//     sendMail(email, otp)

// }

// const saveEditedUserPassword= async (req)=>{
//    try{
//         console.log(req);
//         const genOtp = req.session.otp
//         console.log(req.body.otp +'#####');
//         console.log(genOtp +"@@@@2");
//         // if (req.body.otp === genOtp) {

//         const {password,confirm}=req.body
//         if(req.body.otp === genOtp){
//          if(password === confirm)   {

//             const updateData= await userRepository.findAndEditPassword(req)
//             if( updateData ){
//                 const msg = "New password added"
//                 delete req.session.otp
//                 return { status: 200, msg }
           
//             } else{
//                 const msg = "Something went wrong"
//                 return { status: 500, msg }
           
//             }}

//         } else {
//             const msg='Entered password does not match'
//             return { status: 400 ,msg}
//         }
        
//        }catch(err){console.log(err);}
// }


const saveEditedUserPassword= async (req)=>{
    try{
         
         const {password,confirm}=req.body
          if(password === confirm)   {
 
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
             const msg='Entered password does not match'
             return { status: 400 ,msg}
         }
        }catch(err){console.log(err);}
 }

 const generateOtpAndSendForForgot = async (req) => {
    try{
        const { email } = req.body
        const checkUserExists= await userRepository.findUserByEmail(email)
        console.log(checkUserExists);
        if(!checkUserExists) {
            const msg ="In this email no user exists"
            return {status:202,msg}
        }
        const otp = generatedOtp()
        req.session.otp = otp
        req.session.email=email
        console.log(otp, 'otp');
        sendMail(email, otp)
    }catch(err){console.log(err);}
}

const authAndSavePassword=(req)=>{
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

const changePassord= async (req)=>{
    try{
  const {password,confirm}=req.body
  if(password === confirm){
    const updatePassword= await userRepository.findAndChangePassword(req)
        if(updatePassword){
            console.log(updatePassword);
            const msg="Password changed sucessfully"
            return {status:200,msg}
        }else{
            const msg="Something went wrong"
            return {status:500,msg}
        }
  }else{
    const msg='Password doesnot match'
    return {status:400,msg}
  }
    }catch(err){console.log(err);}
} 

const sortHotels = async (req) =>{
    const sortedData = await userRepository.sortBy(req)
    if(sortedData.length === 0) {
        const commonData = await findHotels(req)
        return commonData
    }
    return sortedData

}

const roomDetails = async (req)=>{
  try{
    const hotelId =req.session.hotelId
    const roomsData = await userRepository.roomDetails(hotelId)
    return roomsData
  }catch(err){console.log(err);}
}

const roomImages= async (req) =>{
    
    try{
        const hotelId =req.session.hotelId
        const images =await userRepository.roomImages(hotelId)
        return images
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
    // generateOtpAndSendToVerifyEmail,
    saveEditedUserPassword,
    generateOtpAndSendForForgot,
    authAndSavePassword,
    changePassord,
    sortHotels,
    roomDetails,
    roomImages
}