const userService = require('../../service/userService')

const userHome=(req,res)=>{
  res.render('user/index')
  //res.render('user/proceedBooking')

}
const userhotelsList= async (req,res)=>{

    const hotels= await userService.findHotels(req)
    if(hotels.status === 400) res.redirect(`/hotelsPage?msg=${hotels.msg}`)
    else res.redirect(`/hotelsPage?msg=${hotels.msg}`)

}
const userhotelsListPage = async (req,res)=>{
    const hotels= await userService.findHotels(req)
    console.log(hotels);
    const userName=''
    const msg=req.query.msg
    res.render('user/hotels',{hotels,msg,userName})
}

const userLogin = (req, res) => {
    const msg=req.query.msg
    res.render('user-login',{msg:msg})
}

const otpVerification = async (req, res) => {
    req.session.userFormData = req.body
    const userData = req.session.userFormData

    const response = await userService.verifyUser(userData)
    if (response.status === 200 || response.status === 400) res.redirect(`/signUp?msg=${response.msg}`)
    else res.redirect('/otpPage')

}
const otpPage = (req, res) => {
    if(!(req.session.otp))userService.generateOtpAndSend(req)  
    const msg=req.query.msg
    res.render('otp',{msg})
}

const otpAuthentication = async (req, res) => {
    const response = await userService.otpAuth(req)
    console.log(response);
    if (response.status === 200) res.redirect('/register')
    if (response.status === 400) res.redirect('/otpPage')
}

const userLoginHome = async (req, res) => {
    const response = await userService.auth(req)
    console.log(response);

    if (response.status === 200) res.redirect('/login/home'); console.log(req.session.user);
    if (response.status === 403) res.redirect(`/login?msg=${response.msg}`)
    if (response.status === 400) res.redirect(`/login?msg=${response.msg}`)

}
const userLoginHomeView = (req, res) => {
    try{
        res.render('user/index')
    }catch(err){console.log(err);}
}

const userRegister = async (req, res) => {
    const userData = req.session.userFormData
    try {
        let response = await userService.userAuthentication(req)

        if (response.status === 200) res.redirect('/login')
        if (response.status === 400) res.redirect(`/signup?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/otpPage?msg=${response.msg}`)

    } catch (error) { console.log(error); }

}

const userRegisterView = (req, res) => {
    res.redirect('/signUp')
}
const userRegisterPage = (req, res) => {
    const msg = req.query.msg
    res.render('user-signup',{msg:msg})
}

const userManagement=(req,res)=>{
res.redirect('/manageYourProfilePage')
}

const userManagementPage=(req,res)=>{
res.render('user/userManagement')
}

const manageYourProfile=(req,res)=>{
    if(!(req.session.user))res.redirect('/login')
    res.redirect('/manageYourProfilePage')
}
const manageYourProfilePage= async (req,res)=>{
    const user= await userService.userDetails(req)
    console.log(user);
    if(user.status === 400) res.redirect(`/manageYourProfilePage?msg=${user.msg}`)
    const msg=req.query.msg
    res.render('user/userProfile',{user,msg})
}
const editUserName= async (req,res)=>{
    try{
    const response= await userService.saveEditedUserName(req)
    console.log(response.status +">>>>>");
    if(response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
    if(response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    }catch(err){console.log(err);}
}
const editUserEmail= async (req,res)=>{
    try{
    const response= await userService.saveEditedUserEmail(req)
    console.log(response.status +">>>>>");
    if(response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
    if(response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    }catch(err){console.log(err);}
}
const editUserMobile= async (req,res)=>{
    try{
    const response= await userService.saveEditedUserMobile(req)
    console.log(response.status +">>>>>");
    if(response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
    if(response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    }catch(err){console.log(err);}
}

const editUserGender= async (req,res)=>{
    try{
    const response= await userService.saveEditedUserGender(req)
    console.log(response.status +">>>>>");
    if(response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
    if(response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    }catch(err){console.log(err);}
}

const editUserAddress= async (req,res)=>{
    try{
    const response= await userService.saveEditedUserAddress(req)
    console.log(response.status +">>>>>");
    if(response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
    if(response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    }catch(err){console.log(err);}
}

// const sendOtpToEmail = (req, res) => {
    
//     if(!(req.session.otp))userService.generateOtpAndSendToVerifyEmail(req)  
   
// }

const editUserPassword= async (req,res)=>{
    try{
    const response= await userService.saveEditedUserPassword(req)
    console.log(response.status +">>>>>");
    if(response.status === 400) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
    if(response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
    if(response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    }catch(err){console.log(err);}
}

const forgotPassword=(req,res)=>{
  res.redirect('/forgotEmailPage')
}

const forgotEmailPage=(req,res)=>{
    const msg=req.query.msg
    res.render('forgotEmailPage',{msg})
}

const emailSubmit= async (req,res)=>{
if(!(req.session.otp)){
   const response= await userService.generateOtpAndSendForForgot(req)  
   if(response.status === 202) res.redirect(`/forgotEmailPage?msg=${response.msg}`)
   else res.redirect('/otpVerificationPage')
}
 
}

const otpVerificationPage=(req,res)=>{
    const msg=req.query.msg
    res.render('otpForgot',{msg})
}

const otpForgotSubmit= async (req,res)=>{
 const response= await userService.authAndSavePassword(req)
 if(response.status === 200) res.redirect(`/newPassword?msg=${response.msg}`)
 if(response.status === 400) res.redirect(`/otpVerificationPage?msg=${response.msg}`)

}

const newPassword=(req,res)=>{
    res.render('newPasswordPage')
}

const newPasswordSubmit= async (req,res)=>{
    try{
  const response= await userService.changePassord(req)
  if(response.status === 200)res.redirect(`/login?msg=${response.msg}`)
  if(response.status === 400)res.redirect(`/newPassword?msg=${response.msg}`)
  if(response.status === 500)res.redirect(`/newPassword?msg=${response.msg}`)

    }catch(err){console.log(err);}
}

const hotelDetails=(req,res)=>{
    const id=req.params._id
    console.log(req.params._id,"22222222");
    req.session.hotelId=id
    console.log(req.session.hotelId+"<<<<444444>>>>");
 res.redirect('/hotelDetailsPage')
}

const hotelDetailsPage= async (req,res)=>{
    try{
    const images= await userService.roomImages(req)
    console.log(images);
    console.log(images.imagesOfHotel[0]);

    const roomArray= await userService.roomDetails(req)
    res.render('user/rooms',{roomArray,images})
    }catch(err){console.log(err);}
}
const sortHotels= async (req,res)=>{
    const sortedHotels=await userService.sortHotels(req)
    const userName=''
    res.render('user/hotels',{sortedHotels,userName})
    console.log(req.query);

}

module.exports = {
    userHome,
    userhotelsList,
    userhotelsListPage,
    userLogin,
    userRegister,
    userRegisterView,
    userRegisterPage,
    otpVerification,
    otpPage,
    otpAuthentication,
    userLoginHome,
    userLoginHomeView,
    userManagement,
    userManagementPage,
    manageYourProfile,
    manageYourProfilePage,
    editUserName,
    editUserEmail,
    editUserMobile,
    editUserGender,
    editUserAddress,
    // sendOtpToEmail,
    editUserPassword,
    forgotPassword,
    forgotEmailPage,
    emailSubmit,
    otpVerificationPage,
    otpForgotSubmit,
    newPassword,
    newPasswordSubmit,
    hotelDetails,
    hotelDetailsPage,
    sortHotels

}