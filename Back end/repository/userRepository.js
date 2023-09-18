const User=require('../domain/model/user')
const hotels=require('../domain/model/hotel')

const findUserByEmail=async (email)=>{
    try {
        return await User.findOne({email:email})
    } catch (error) {
        console.log(error);
    }
}

const findAllHotels= async ()=>{
    try {
        return await hotels.find({})
    } catch (error) {
        console.log(error);
    }
}
module.exports={
    findUserByEmail,
    findAllHotels
}