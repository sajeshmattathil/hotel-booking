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
        return await hotels.find({isApproved:true})
    } catch (error) {
        console.log(error);
    }
}
const findAndEditName= async (req)=>{
    try{
        const email=req.session.user
        console.log(email+"<<<<<<>>>>>>");
        const {first_name,last_name}=req.body
        console.log(first_name+"??????????");
        return await User.updateOne({email:email},{$set:{first_name:first_name,last_name:last_name}})
    }catch(err){console.log(err);}
}
const findAndEditEmail= async (req)=>{
    try{
        const email=req.session.user
        console.log(email+"<<<<<<>>>>>>");

        const newEmail=req.body.email
        console.log(newEmail+"<<<<<<>>>>>>");
        req.session.user=newEmail
        return await User.updateOne({email:email},{$set:{email:newEmail}})
    }catch(err){console.log(err);}
}

const findAndEditMobile= async (req)=>{
    try{
        const email=req.session.user
        console.log(email+"<<<<<<>>>>>>");

        const mobile=req.body.mobile
        return await User.updateOne({email:email},{$set:{mobile:mobile}})
    }catch(err){console.log(err);}
}

const findAndEditGender= async (req)=>{
    try{
        const email=req.session.user
        console.log(email+"<<<<<<>>>>>>");

        const gender=req.body.gender
        return await User.updateOne({email:email},{$set:{gender:gender}})
    }catch(err){console.log(err);}
}

const findAndEditAddress= async (req)=>{
    try{
        const email=req.session.user
        console.log(email+"<<<<<<>>>>>>");

        const {address,city,pin}=req.body
        return await User.updateOne({email:email},{$set:{'addressDetails.address':address,'addressDetails.city':city,'addressDetails.pin':pin}})
    }catch(err){console.log(err);}
}

const findAndEditPassword= async (req)=>{
    try{
        const email=req.session.user
        console.log(email+"<<<<<<>>>>>>");

        const {password}=req.body
        return await User.updateOne({email:email},{$set:{password:password}})
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
    findAndEditPassword
}