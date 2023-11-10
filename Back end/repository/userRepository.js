const User = require('../domain/model/user')
const hotels = require('../domain/model/hotel')
const rooms = require('../domain/model/room')
const bookings = require('../domain/model/bookings')
const bookinghistory = require('../domain/model/bookingHistory')
const walletTransaction = require('../domain/model/wallet')
const coupons = require('../domain/model/coupon')
const offers = require ('../domain/model/category_offer')
const bcrypt = require('bcryptjs')
const invoiceNumber = require('../utils/invoiceNumber')

const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email: email })
    } catch (error) {
        console.log(error);
    }
}

const findAllHotels = async (cityName,page) => {
    try {
        if (cityName) {
            console.log(cityName,"parameter received as city");
            const data = await hotels.find({ isApproved: true, city:cityName }).skip((page-1) * 3).limit(3)
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
        console.log(3);
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
        const { newPassword } = req.body
        console.log(newPassword);
        const hashPassword = await bcrypt.hash(newPassword, 10)
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
        console.log(hotelId,"hotelId");
        // const roomArray = await rooms.aggregate([

        //     {
        //         $match:{hotel:hotelId}
        //     },
        //     // {
        //     //     $group: {
        //     //         _id: "$roomType",
        //     //         price: { $addToSet: "$price" }
        //     //     }
        //     // },
        //     // {
        //     //     $project: {
        //     //         type: "$roomType",
        //     //         price: 1
        //     //     }
        //     // }
        // ]);
        const roomArray  = await rooms.find({hotel:hotelId})
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
const getRoom = async (roomId) => {
    try {
        return await rooms.findOne({ _id: roomId })
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

const findUserHistory= async (email)=>{
try{
         return await bookinghistory.aggregate([
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
            status:"$status",
            bookingId:"$booking_id",
            roomNumber:"$roomNumber",
            checkin: "$checkin_date",
            checkout: "$checkout_date",
            hotelName: "$hotelInfo.hotel_name",
            roomType: "$roomInfo.roomType",
            city:"$hotelInfo.city",

            hotelImage:    {  
                $arrayElemAt: ["$hotelInfo.imagesOfHotel", 0]
            } ,
            otherDetails:"$otherDetails"         
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
        console.log(id,"id");
        return await bookinghistory.findOne({booking_id:id})
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


const findAndUpdateHistory = async (bookingId)=>{
    try{
            return await bookinghistory.updateOne({booking_id:bookingId},{$set:{status:"cancelled"}})
    }catch(err){console.log(err);}
}


const findAndDelete = async (bookingId)=>{
    try{
        return await bookings.deleteOne({_id:bookingId})
    }catch(err){console.log(err);}
}

const findBookingsForUpdation = async ()=>{
    try{
        const today = Date.now()
        console.log(today,"today");
        return await bookinghistory.find({checkout_date:{$lt:today}})
    }catch(err){console.log();}
}

const updatePendingMoney = async (id,amount)=>{
    try{
        console.log(id,amount,"id,amount")
        const today = Date.now()
        return await bookinghistory.updateOne(
            {"otherDetails.paymentMode":"offline",_id:id},
             {$set:{"otherDetails.moneyPaid":amount,"otherDetails.pendingAmount":0}},
           
            )
    }catch(err){console.log(err);}
}
const findAndUpdateAllHistory = async ()=>{
    try{
        const today = Date.now()
        console.log(today,"today");
        return await bookinghistory.updateMany({checkout_date:{$lt:today}},{$set:{status:"completed"}})

    }catch(err){console.log(err);}
}
const findAndDeleteAll = async ()=>{
    try{
        const today = Date.now()
        console.log(today,"today");
        return await bookings.deleteMany({checkout_date:{$lt:today}})
    }catch(err){console.log(err);}
}

const  updateInvoiceNumber = async (booking_id,invoiceNumber)=>{
    try{
        console.log(booking_id,invoiceNumber,"booking_id,invoiceNumber");
       return await bookinghistory.updateOne({booking_id:booking_id},{$set:{invoice_number:invoiceNumber}})
    }catch(err){console.log(err);}
}
 
const findBookingDetail= async (invoice_number)=>{
    try{
        console.log(invoice_number,"invoice_number");
             return await bookinghistory.aggregate([
        {
            $match: {invoice_number:invoice_number } 
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
                status:"$status",
                bookingId:"$booking_id",
                invoice_number:"$invoice_number",
                roomNumber:"$roomNumber",
                checkin: "$checkin_date",
                checkout: "$checkout_date",
                hotelName: "$hotelInfo.hotel_name",
                roomType: "$roomInfo.roomType",
                city:"$hotelInfo.city",   
                amount:"$otherDetails.moneyPaid"         
            }
        }
    ]);  
    }catch(err){console.log(err.message);}
    }  

const filerHotels = async (city,body)=>{
    try{
        let data
        let { amenities, star_rating } = body
        console.log(amenities, star_rating,65465465465);

       
        if(typeof (amenities) === 'object' && typeof (star_rating) === 'string' ){
            data = await hotels.find({city:city,amenities:{$in:amenities},star_rating:star_rating})
            return data 
        }
        else if(typeof (amenities) === 'string' && typeof (star_rating) === 'object' ){
            star_rating = {$in:star_rating}
            data = await hotels.find({city:city,amenities:amenities,star_rating:{$in:star_rating}})
            return data 
        }
        else if(typeof (amenities) === 'object' && typeof (star_rating) === 'object' ){
           
            data = await hotels.find({city:city,amenities:{$in:amenities},star_rating:{$in:star_rating}})
            return data 
        }


        console.log(city,amenities,star_rating,"city,amenities,star_rating111")
        return await hotels.find({city:city},{amenities:amenities,star_rating:star_rating})
    }catch(err){console.log(err);}
}
const filerHotelsifOneMissing = async (city,amenities,star_rating)=>{
    try{
        console.log(city,amenities,star_rating,"city,amenities,star_rating2222")

        const query = { city: city };

        if (amenities) {
          query.amenities = amenities;
        }       
        if (star_rating) {
          query.star_rating = star_rating;
        }       
        return await hotels.find(query);
        
    }catch(err){console.log(err);}
}

const findTransactions = async (id)=>{
    try{
        console.log(id,"id");
        return await walletTransaction.find({transaction_id:id})
    }catch(err){console.log(err.message);}
}

const findHotel = async (id)=>{
    try{
        return await hotels.findOne({_id:id})
    }catch(err){console.log(err.message);}
}
const findRoom = async (id)=>{
    try{
        return await rooms.findOne({_id:id})
    }catch(err){console.log(err.message);}
}
module.exports = {
    findHotel,
    findRoom,
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
    findAndUpdateHistory,
    findAndDelete,
    findBookingsForUpdation,
    findAndUpdateAllHistory,
    findAndDeleteAll,
    updatePendingMoney,
    updateInvoiceNumber,
    findBookingDetail,
    //findSalesData,
    filerHotelsifOneMissing,
    filerHotels,
    findTransactions,
    getRoom
   
}




