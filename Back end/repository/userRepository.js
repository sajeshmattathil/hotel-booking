const User=require('../domain/model/user')

const findUserByEmail=async (email)=>{
    try {
        return await User.findOne({email:email})
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    findUserByEmail
}