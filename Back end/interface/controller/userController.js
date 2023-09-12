const { error } = require('console')
const userService=require('../../service/userService')

const userLogin=(req,res)=>{
    res.render('user-login')
}

const otpVerification=async (req,res)=>{ 
    req.session.userFormData=req.body
    res.redirect('/otpPage')
}
const otpPage=(req,res)=>{
       const sendMail=userService.generateOtpAndSend(req)
    res.render('otp')
}

const otpAuthentication=async (req,res)=>{
 let response=await userService.otpAuth(req)
 console.log(response);
 if(response.status === 200) res.redirect('/register')
 if(response.status === 400) res.redirect('/otpPage')
}

const userLoginHome=async (req,res)=>{
   let response=await userService.auth(req)
   console.log(response);

   if(response.status===403) res.redirect('/login')  
   if(response.status===200) res.redirect('/login/home'); console.log( req.session.user);
   if(response.status===400) res.redirect('/login') 
   
}
const userLoginHomeView=(req,res)=>{
    res.render('userHome')
}

const userRegister=async(req,res)=>{
    const userData=req.session.userFormData
  try{  
   let response=await userService.userAuthentication(userData)

     if(response.status===200) res.redirect('/login')
     if(response.status===400) res.redirect('/signup')
     if(response.status===500) res.redirect('/otpPage')

  }catch(error) {console.log(error);}
      
}

const userRegisterView=(req,res)=>{
    res.redirect('/signUp')
}
const userRegisterPage=(req,res)=>{
    res.render('user-signup')
}
module.exports={
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