const Owner = require('../domain/model/owner')
const hotel = require('../domain/model/hotel')
const category=require('../domain/model/category')
const subcategory=require('../domain/model/subCategory')
const rooms=require('../domain/model/room')
const offer = require('../domain/model/category_offer')

const findOwnerByEmail = async (email) => {
    try {
        return await Owner.findOne({ email: email })
    } catch (error) {
        console.log(error);
    }
}

const findOwnerNameByEmail = async (email) => {
    try {
        return await Owner.findOne({ email: email }, { _id: 0, owner_name: 1 }).lean()
    } catch (error) {
        console.log(error);
    }
}

const FindHotelByName = async (hotel_name) => {
    try {
        return await hotel.findOne({ hotel_name: hotel_name })
         
    } catch (error) {
        console.log(error);
    }
}
const findHotelsWithIncompleteDetails= async ()=>{
    try {
        return await hotel.find({ status: "inactive" }).lean()
         
    } catch (error) {
        console.log(error);
    }
}
const findCategories= async ()=>{
    try {
        return await category.find({})
         
    } catch (error) {
        console.log(error);
    }
}
const findSubCategories= async ()=>{
    try {
        return await subcategory.find({})
         
    } catch (error) {
        console.log(error);
    }
}

const addRoomNumbers= async (hotel_id,roomType,roomCount,RoomNumberStartwith)=>{
  try{
    console.log(hotel_id,'><><',roomType,"nn",roomCount,'<><',RoomNumberStartwith);
    for(let i=0;i<roomCount;i++){
        await rooms.updateOne({hotel:hotel_id,roomType:roomType},{$push:{roomNumbers:String(RoomNumberStartwith) }})
        RoomNumberStartwith++
    }
        
  }catch(err){console.log();}
}

const findOffers = async (hotel_id)=>{
    try {
        return await offer.find({hotel_id:hotel_id})
         
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    findOwnerByEmail,
    findOwnerNameByEmail,
    FindHotelByName,
    findHotelsWithIncompleteDetails,
    findCategories,
    findSubCategories,
    addRoomNumbers,
    findOffers

}