const Admin = require('../domain/model/Admin')
const hotels=require('../domain/model/hotel')
const category=require('../domain/model/category')
const subcategory=require('../domain/model/subCategory')



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

const findHotelAndApprove=async (email)=>{
    try {
        const filter = { email: email };
        const update = { $set: { isApproved: true } };
             return await hotels.updateOne(filter, update)
    } catch (error) {
        console.log(error);
    }
}
const findCategoryByName= async (name)=>{
    try {
        
             return await category.findOne({name:name})
    } catch (error) {
        console.log(error);
    }
}

const findSubCategoryByName= async (name)=>{
    try {
        
             return await subcategory.findOne({name:name})
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    findAdminByEmail,
    findAdminNameByEmail,
    findHotelApprovalRequests,
    findHotelAndApprove,
    findCategoryByName,
    findSubCategoryByName
}