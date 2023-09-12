const bcrypt=require('bcryptjs')
const userRepository=require('../repository/userRepository')
const User=require('../domain/model/user')
const sendMail=require('../utils/mailer')
const generatedOtp=require('../utils/otpGenerator')


   const auth=async (req)=>{
    const {email,password}=req.body
    if (!email && !password) {
        return {status:403}
   }
    try{
      const user=await userRepository.findUserByEmail(email)
      console.log(user);
      const checkedPassword = await bcrypt.compare(password, user.password)

               if (user && checkedPassword) {
                    if (user.isUser) {
                        req.session.user=email; 
                       return {status:200}
                    }
                  }
               else  return {status:400}
    }catch(error){
        console.log(error);
    }
   }


  const generateOtpAndSend=(req)=>{
      const otp=generatedOtp()
      req.session.otp=otp
      const userData=req.session.userFormData
      const email=userData.email
      console.log(otp,'otp');
      sendMail(email,otp)
  }

  const otpAuth=async (req)=>{
       const genOtp=req.session.otp
        console.log(req.body.otp);
        console.log(genOtp);
      if(req.body.otp === genOtp){
        return {status:200}
      }else{
        return {status:400}
      }
   }

//    const userAuthentication=async (userData)=>{
//     console.log(userData);
//         const {first_name,last_name,email,mobile,password,confirm}=userData

//         if(!first_name || !last_name ||!email ||!mobile ||!password ||!confirm){
//             console.log('fiii empty fields');
//             return {status:400}
//         }
//  //confirm password
//         if(password!==confirm){
//             console.log('passwords must match');
//            return {status:400}
//         }else{
            
//             const existingUserData=await userRepository.findUserByEmail(email)
//             existingUserData.then((user)=>{
//                 if(user){       
//                    return {status:400}
//                 }
//  //validation
//                 else{
//                   const newUser=new User({
//                     first_name,
//                     last_name,
//                     email,
//                     mobile,
//                     password
//                 })
// //password validating  
//                     bcrypt.genSalt(10,(err,salt)=>
//                     bcrypt.hash(newUser.password,salt,(err,hash)=>{
//                         if(err) throw err
//                         newUser.password=hash
//                         newUser.save().then(()=>{
//                     return {status:200}
//                         } )
//                         .catch((err)=>{console.log(err) })
//                     }))

//         }})
//               }

//     }


const userAuthentication = async (userData) => {
    console.log(userData);
    try {
    const { first_name, last_name, email, mobile, password, confirm } = userData;

    if (!first_name || !last_name || !email || !mobile || !password || !confirm) {
        console.log('Fill in empty fields');
        return { status: 400 };
    }

    // Confirm password
    if (password !== confirm) {
        console.log('Passwords must match');
        return { status: 400 };
    }
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

        if(newUser){
            return { status: 200 }
        }else{
            return { status: 400 }; 
        }

    } catch (error) {
        console.log(error);
        return { status: 500 }; 
    }
}

   

module.exports= {
    userAuthentication,
     generateOtpAndSend,
    auth,
    otpAuth
}