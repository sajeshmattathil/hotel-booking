const User=require('../domain/model/user')
const hotels=require('../domain/model/hotel')
const rooms=require('../domain/model/room')
const bcrypt=require('bcryptjs')

const findUserByEmail=async (email)=>{
    try {
        return await User.findOne({email:email})
    } catch (error) {
        console.log(error);
    }
}

const findAllHotels= async (cityName)=>{
    try {  
        if(cityName){ const data= await hotels.find({isApproved:true,city:cityName}).limit(10)
        if(data.length === 0){
            return await hotels.find({isApproved:true})
        }
        return data
    }
        else console.log('cityName not found');
        
    } catch (error) {
        console.log(error);
    }
}
const findAndEditName= async (req)=>{
    try{
        const email=req.session.user
        const {first_name,last_name}=req.body
        console.log(first_name+"??????????");
        return await User.updateOne({email:email},{$set:{first_name:first_name,last_name:last_name}})
    }catch(err){console.log(err);}
}
const findAndEditEmail= async (req)=>{
    try{
        const email=req.session.user
        const newEmail=req.body.email
        req.session.user=newEmail
        return await User.updateOne({email:email},{$set:{email:newEmail}})
    }catch(err){console.log(err);}
}

const findAndEditMobile= async (req)=>{
    try{
        const email=req.session.user
        const mobile=req.body.mobile
        return await User.updateOne({email:email},{$set:{mobile:mobile}})
    }catch(err){console.log(err);}
}

const findAndEditGender= async (req)=>{
    try{
        const email=req.session.user
        const gender=req.body.gender
        return await User.updateOne({email:email},{$set:{gender:gender}})
    }catch(err){console.log(err);}
}

const findAndEditAddress= async (req)=>{
    try{
        const email=req.session.user
        const {address,city,pin}=req.body
        return await User.updateOne({email:email},{$set:{'addressDetails.address':address,'addressDetails.city':city,'addressDetails.pin':pin}})
    }catch(err){console.log(err);}
}

const findAndEditPassword= async (req)=>{
    try{
        const email=req.session.user
        const {password}=req.body
        console.log(password);
        const hashPassword = await bcrypt.hash(password, 10)
        return await User.updateOne({email:email},{$set:{password:hashPassword}})
    }catch(err){console.log(err);}
}

const findAndChangePassword= async (req)=>{
    try{
        const email=req.session.email
        const {password}=req.body
        const hashPassword = await bcrypt.hash(password, 10)
        return await User.updateOne({email:email},{$set:{password:hashPassword}})
    }catch(err){console.log(err);}
}

const sortBy = async (req) =>{
try{
    const cityName= req.session.city
    const sort=req.query.sort
    const sortCriteria = {};
    sortCriteria[sort] = -1; 
    return hotels.find({city:cityName}).sort(sortCriteria)
        
    
}catch(err){console.log(err.message);}

}

const roomDetails = async(hotelId)=>{
    try{
     return await rooms.find({hotel:hotelId})
    }catch(err){console.log(err);}
}
module.exports={
    findUserByEmail,
    findAllHotels,
    findAndEditName,
    findAndEditEmail,
    findAndEditMobile,
    findAndEditGender,
    findAndEditAddress,
    findAndEditPassword,
    findAndChangePassword,
    
    sortBy,
    roomDetails
}