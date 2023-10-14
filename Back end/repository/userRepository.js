const User = require('../domain/model/user')
const hotels = require('../domain/model/hotel')
const rooms = require('../domain/model/room')
const bookings = require('../domain/model/bookings')
const Bookinghistory = require('../domain/model/bookingHistory')
const coupons = require('../domain/model/coupon')
const offers = require ('../domain/model/category_offer')
const bcrypt = require('bcryptjs')

const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email: email })
    } catch (error) {
        console.log(error);
    }
}

const findAllHotels = async (cityName) => {
    try {
        if (cityName) {
            console.log(cityName,"parameter received as city");
            const data = await hotels.find({ isApproved: true, city:cityName }).limit(10)
            if (data.length === 0) {
                console.log("Showing all the hotels");
                return await hotels.find({ isApproved: true })
            }
            return data
        }
        else console.log('cityName not found');

    } catch (error) {
        console.log(error);
    }
}
const findAndEditName = async (req) => {
    try {
        const email = req.session.user
        const { first_name, last_name } = req.body
        console.log(first_name + "??????????");
        return await User.updateOne({ email: email }, { $set: { first_name: first_name, last_name: last_name } })
    } catch (err) { console.log(err); }
}
const findAndEditEmail = async (req) => {
    try {
        const email = req.session.user
        const newEmail = req.body.email
        req.session.user = newEmail
        return await User.updateOne({ email: email }, { $set: { email: newEmail } })
    } catch (err) { console.log(err); }
}

const findAndEditMobile = async (req) => {
    try {
        const email = req.session.user
        const mobile = req.body.mobile
        return await User.updateOne({ email: email }, { $set: { mobile: mobile } })
    } catch (err) { console.log(err); }
}

const findAndEditGender = async (req) => {
    try {
        const email = req.session.user
        const gender = req.body.gender
        return await User.updateOne({ email: email }, { $set: { gender: gender } })
    } catch (err) { console.log(err); }
}

const findAndEditAddress = async (req) => {
    try {
        const email = req.session.user
        const { address, city, pin } = req.body
        return await User.updateOne({ email: email }, { $set: { 'addressDetails.address': address, 'addressDetails.city': city, 'addressDetails.pin': pin } })
    } catch (err) { console.log(err); }
}

const findAndEditPassword = async (req) => {
    try {
        const email = req.session.user
        const { password } = req.body
        console.log(password);
        const hashPassword = await bcrypt.hash(password, 10)
        return await User.updateOne({ email: email }, { $set: { password: hashPassword } })
    } catch (err) { console.log(err); }
}

const findAndChangePassword = async (req) => {
    try {
        const email = req.session.email
        const { password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        return await User.updateOne({ email: email }, { $set: { password: hashPassword } })
    } catch (err) { console.log(err); }
}

const sortBy = async (req) => {
    try {
        const cityName = req.session.city
        let sortCriteria = {};

        const sort = req.body.sort
        if(sort === low) sortCriteria[price] = 1;
        else if(sort === high) sortCriteria[price] = -1;
        return hotels.find({ city: cityName }).sort(sortCriteria)
    } catch (err) { console.log(err.message); }
}
const roomDetails = async (hotelId) => {
    try {
        const roomArray = await rooms.aggregate([
            {
                $group: {
                    _id: "$roomType",
                    price: { $addToSet: "$price" }
                }
            },
            {
                $project: {
                    type: "$roomType",
                    price: 1
                }
            }
        ]);
        console.log(roomArray);

        return roomArray;

    } catch (err) { console.log(err); }
}

const roomImages = async (hotelId) => {
    try {
        const images = await hotels.findOne({ _id: hotelId }).lean()
        return images;

    } catch (err) { console.log(err); }
}

const selectedRoomDetails = async (roomType) => {
    try {
        return await rooms.findOne({ roomType: roomType })
    } catch (err) { console.log(err); }

}

const selectedHotelDetails = async (hotelId) => {
    try {
        return await hotels.findOne({ _id: hotelId })
    } catch (err) { console.log(err); }
}

const selectedRoom = async (roomData) => {
    try {
        return await rooms.findOne({ _id: roomData._id })
    } catch (err) { console.log(err); }
}
  
const findCouponByUser=async (email)=>{
    try{
        return await coupons.find({used_users:{$ne:email}})
    }catch(err){console.log(err);}
}

const removeRoomNumber = async (roomData) => {
    try {
        return await rooms.updateOne({ _id: roomData._id }, { $pop: { roomNumbers: -1 } })
    } catch (err) { console.log(err); }
}

const findAvailableRooms = async (startDate, endDate, hotel_id, room_id) => {
    try {
        return await bookings.find({
            hotel_id: hotel_id, room_id: room_id,
            $nor: [
                {
                    checkin_date: { $lte: startDate },
                    checkout_date: { $gte: endDate }
                }
               
              
            ]

        })
    } catch (err) { console.log(err); }
}




const bothStartEndOverlaps = async (startDate, endDate, hotel_id, room_id) => {
    try {
        return await bookings.find({
            hotel_id: hotel_id, room_id: room_id,
            $and: [
                {
                    checkin_date: { $lte: startDate },
                    checkout_date: { $gte: endDate }
                }
               
              
            ]

        })
    } catch (err) { console.log(err); }
}

const onlyEndOverlaps = async (startDate, endDate, hotel_id, room_id) => {
    try {
        return await bookings.find({
            hotel_id: hotel_id, room_id: room_id,
            $and: [
                {
                    checkin_date: { $lte: endDate },
                    checkout_date: { $gte: endDate }
                }
               
              
            ]

        })
    } catch (err) { console.log(err); }
}

const onlyStartOverlapsRooms = async (startDate, endDate, hotel_id, room_id) => {
    try {
        return await bookings.find({
            hotel_id: hotel_id, room_id: room_id,
            $and: [
                {
                    checkin_date: { $lte: startDate },
                    checkout_date: { $gte: startDate }
                }
               
              
            ]

        })
    } catch (err) { console.log(err); }
}


const findWalletMoney = async (email)=>{
    try{
        return await User.findOne({email:email},{wallet:1,_id:0})
     }catch(err){console.log(err);}
}

// const findOverlapping = async (startDate, endDate, hotel_id, room_id) => {
//     try {
//         console.log(startDate, endDate, hotel_id, room_id,">>>>>>>")
//         return await  bookings.find({
//             hotel_id: hotel_id,
//             room_id: room_id,
           
//                     $nor: [
//                         {
//                             checkin_date: { $gte: startDate },
//                             checkin_date: { $lte: endDate }
//                         },
//                         {
//                             checkout_date: { $gte: startDate },
//                             checkout_date: { $lte: endDate }
//                         }
//                     ]
//                 }
//         )
             
// } catch (err) { console.log(err.message); }
// }

const updateUserWallet = async (user,amount) =>{
    try{
        return await User.updateOne({email:user},{$inc:{wallet:-amount}})
     }catch(err){console.log(err);}
}

const  findAllRoomNumber= async ()=>{
    try{
       return await bookings.distinct("roomNumber")
    }catch(err){console.log(err);}
}

const getBookingId = async (user,roomNumber,hotel_id,room_Id,startDate,endDate) =>{
    try{
        return await bookings.findOne({userName:user,roomNumber:roomNumber,hotel_id:hotel_id,room_id:room_Id,checkin_date:startDate,checkout_date:endDate})
     }catch(err){console.log(err);}
}

const findUserHistory= async (email)=>{
try{
         return await bookings.aggregate([
    {
        $match: { userName: email } 
     },
    {
        $lookup: {
            from: "hotels",
            localField: "hotel_id",
            foreignField: "_id",
            as: "hotelInfo"
        }
     },
    {
        $unwind: "$hotelInfo" 
    },
    {
        $lookup: {
            from: "rooms",
            localField: "room_id",
            foreignField: "_id",
            as: "roomInfo"
        }
    },
    {
        $unwind: "$roomInfo"
    },
    {
        $project: {
            userName: 1,
            bookingId:"$_id",
            roomNumber:"$roomNumber",
            checkin: "$checkin_date",
            checkout: "$checkout_date",
            hotelName: "$hotelInfo.hotel_name",
            roomType: "$roomInfo.roomType",
            city:"$hotelInfo.city",
            hotelImage:    {  
                $arrayElemAt: ["$hotelInfo.imagesOfHotel", 0]
            }          
        }
    }
]);

}catch(err){console.log(err);}
}

const findOffers = async (roomType)=>{
    try{
      return await offers.findOne({roomType:roomType})
    }catch(err){console.log(err);}
}

const findUserByReferal = async (code)=>{
    try{
        return await User.findOne({"referal.referalCode":code})
    }catch(err){console.log(err);}
}

const updateReferalForExistinUser = async (id)=>{
    try{
        return await User.updateOne({_id:id},{$inc:{"referal.referalMoney":100,wallet:100}})
    }catch(err){console.log(err);}
}
const updateNewUserWallet = async (email)=>{
    try{
        return await User.updateOne({email:email},{$inc:{wallet:50}})
    }catch(err){console.log(err);}
}

const bookingDetails = async (id)=>{
    try{
        return await bookings.findOne({_id:id})
    }catch(err){console.log(err);}
}

const updateUserWalletAdd = async (user,amount) =>{
    try{
        return await User.updateOne({email:user},{$inc:{wallet:amount}})
    }catch(err){console.log(err);}
}

const findAllBookingsWithRoomNumber = async (roomNumber) =>{
    try{
        return await bookings.find({roomNumber:roomNumber})
    }catch(err){console.log(err);}
}

const updateRoomNumberArray = async (room_id,roomNumber)=>{
    try{
        return await rooms.updateOne({_id:room_id},{$push:{roomNumbers:roomNumber}})
    }catch(err){console.log(err);}
}



const findAndCancel = async (bookingId)=>{
    try{
        await Bookinghistory.updateOne({booking_id:bookingId},{$set:{status:"cancelled"}})
        return await bookings.deleteOne({_id:bookingId})
    }catch(err){console.log(err);}
}
module.exports = {
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
    roomDetails,
    roomImages,
    selectedRoomDetails,
    selectedHotelDetails,
    selectedRoom,
    removeRoomNumber,
    findAvailableRooms,
   // findOverlapping,
    findUserHistory,
    findCouponByUser,
    findAllRoomNumber,
    findOffers,
    findUserByReferal,
    updateReferalForExistinUser,
    updateNewUserWallet,

    bothStartEndOverlaps,
    onlyEndOverlaps,
    onlyStartOverlapsRooms ,
    findWalletMoney,
    updateUserWallet,
    bookingDetails,
    updateUserWalletAdd,
    findAllBookingsWithRoomNumber,
    updateRoomNumberArray,
    findAndCancel,
    getBookingId

}




