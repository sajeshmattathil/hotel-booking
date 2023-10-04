const Admin = require('../domain/model/Admin')
const hotels=require('../domain/model/hotel')
const category=require('../domain/model/category')
const subcategory=require('../domain/model/subCategory')
const owner=require('../domain/model/owner')
const coupons=require('../domain/model/coupon')



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
        console.log(email);
        return await hotels.updateOne({email:email},{ $set: { isApproved: true } })
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

const findOwnerByEmail= async (email)=>{
    try {
        
        return await owner.findOne({email:email})
} catch (error) {
   console.log(error);
}
}

const findExistingCoupons=async()=>{
    try {
            const today=new Date()
            const todayDate=today.toISOString().split('T')[0]
        return await coupons.find({expiry:{$gte:todayDate}})
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
    findSubCategoryByName,
    findOwnerByEmail,
    findExistingCoupons
}