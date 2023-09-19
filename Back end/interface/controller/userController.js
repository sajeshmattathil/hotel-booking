
const userService = require('../../service/userService')

const userHome=(req,res)=>{
    //res.render('user/index')
    res.render('user/userManagement')
}
const userhotelsList= async (req,res)=>{
    const hotels= await userService.findHotels()
    if(hotels.status === 400) res.redirect(`/hotelsPage?msg=${hotels.msg}`)
    else res.redirect(`/hotelsPage?msg=${hotels.msg}`)

}
const userhotelsListPage = async (req,res)=>{
    const hotels= await userService.findHotels()
    const msg=req.query.msg
    console.log(hotels[0].imagesOfHotel[0]);
    res.render('user/hotels',{hotels,msg})
}




const userLogin = (req, res) => {
    const msg=req.query.msg
    res.render('user-login',{msg:msg})
}

const otpVerification = async (req, res) => {
    req.session.userFormData = req.body
    const userData = req.session.userFormData

    const response = await userService.verifyUser(userData)
    console.log(response);
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
    res.render('userHome')
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


}