const Admin = require('../domain/model/Admin')
const hotels=require('../domain/model/hotel')



const findAdminByEmail=async (email)=>{
    try {
        return await Admin.findOne({ email: email })
    } catch (error) {
        console.log(error);
    }
}

const findAdminNameByEmail=async (email)=>{
    try {
        return await Admin.findOne({ email: email },{_id:0,name:1}).lean()
    } catch (error) {
        console.log(error);
    }
}

const findHotelApprovalRequests=async ()=>{
    try {
        return await hotels.find({isApproved:false},{hotel_name:1,owner_id:1,email:1})
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    findAdminByEmail,
    findAdminNameByEmail,
    findHotelApprovalRequests
}