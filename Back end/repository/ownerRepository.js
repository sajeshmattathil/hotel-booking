const Owner = require('../domain/model/owner')
const hotel = require('../domain/model/hotel')
const category = require('../domain/model/category')
const subcategory = require('../domain/model/subCategory')
const rooms = require('../domain/model/room')
const offer = require('../domain/model/category_offer')
const bookinghistory = require('../domain/model/bookingHistory')

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

const findTotalHotels = async (id)=>{
    try{
        console.log(id,"id")
      return await hotel.find({owner_id:id})
    }catch(err){console.log(err.message);}
}

const FindHotelByName = async (hotel_name) => {
    try {
        return await hotel.findOne({ hotel_name: hotel_name })

    } catch (error) {
        console.log(error);
    }
}
const findHotelsWithIncompleteDetails = async () => {
    try {
        return await hotel.find({ status: "inactive" ,isApproved:true}).lean()

    } catch (error) {
        console.log(error);
    }
}
const findCategories = async () => {
    try {
        return await category.find({})

    } catch (error) {
        console.log(error);
    }
}
const findSubCategories = async () => {
    try {
        return await subcategory.find({})

    } catch (error) {
        console.log(error);
    }
}

const addRoomNumbers = async (hotel_id, roomType, roomCount, RoomNumberStartwith) => {
    try {
        console.log(hotel_id, '><><', roomType, "nn", roomCount, '<><', RoomNumberStartwith);
        for (let i = 0; i < roomCount; i++) {
            await rooms.updateOne({ hotel: hotel_id, roomType: roomType }, { $push: { roomNumbers: String(RoomNumberStartwith) } })
            RoomNumberStartwith++
        }

    } catch (err) { console.log(); }
}

const findOffers = async (hotel_id) => {
    try {
        return await offer.find({ hotel_id: hotel_id })

    } catch (error) {
        console.log(error);
    }
}

const updateOwnerWallet = async (hotelId, getBookingId, ownerAmount) => {
    try {
        console.log(hotelId, getBookingId, ownerAmount, "hotelId,getBookingId,ownerAmount")
        const ownerData = await bookinghistory.aggregate([
            {
                $match: { _id: getBookingId }
            },
            {
                $lookup: {
                    from: "hotels",
                    localField: "hotel_id",
                    foreignField: "_id",
                    as: "ownerInfo"
                }

            },
            {
                $unwind: "$ownerInfo"
            },
            {
                $project: {
                    owner_id: "$ownerInfo.owner_id"
                }
            }
        ])
        console.log(ownerData, 'ownerData');

        console.log(ownerData, 'ownerData');
        return await Owner.updateOne({ _id: ownerData[0].owner_id }, { $inc: { wallet: ownerAmount } })
    } catch (err) { console.log(err); }
}

const updateOfferStatus = async (status,id)=>{
    try{     
        console.log(status,id,"status,id")
        await offer.updateOne({name:id},{$set:{isActive:status}})
    }catch(err){console.log(err.message);}
}

const findOwnerHotels = async (id)=>{
    try{     
        
       return await hotel.find({owner_id : id},{_id :1})
    }catch(err){console.log(err.message);}
}
const findTotalSales = async (id)=>{
    try{     
        
       return await bookinghistory.find({hotel_id : id,status :"completed"})
        
    }catch(err){console.log(err.message);}
}
module.exports = {
    findOwnerHotels,
    findTotalSales,
    findTotalHotels,
    findOwnerByEmail,
    findOwnerNameByEmail,
    FindHotelByName,
    findHotelsWithIncompleteDetails,
    findCategories,
    findSubCategories,
    addRoomNumbers,
    findOffers,
    updateOwnerWallet,
    updateOfferStatus

}