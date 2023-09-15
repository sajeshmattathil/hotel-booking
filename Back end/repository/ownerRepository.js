const Owner = require('../domain/model/owner')
const hotel = require('../domain/model/hotel')



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



module.exports = {
    findOwnerByEmail,
    findOwnerNameByEmail,
    FindHotelByName,
    findHotelsWithIncompleteDetails

}