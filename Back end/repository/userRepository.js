const User = require('../domain/model/user')
const hotels = require('../domain/model/hotel')
const rooms = require('../domain/model/room')
const bookings = require('../domain/model/bookings')
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
                    checkin_date: { $lt: startDate },
                    checkout_date: { $gt: endDate }
                },

                {
                    checkin_date: { $lt: endDate },
                    checkout_date: { $gt: endDate }
                },
                {
                    checkin_date: { $gte: startDate, $lt: endDate },
                    checkout_date: { $lte: endDate }
                }
            ]

        })
    } catch (err) { console.log(err); }
}

const findOverlapping = async (startDate, endDate, hotel_id, room_id) => {
    try {
        console.log(startDate, endDate, hotel_id, room_id,">>>>>>>")
        return await bookings.find({
            hotel_id: hotel_id, 
            room_id: room_id,
            $or: [
                { 
                    checkin_date: { $lt: startDate },
                    checkout_date: { $lt: startDate }
                },
                { 
                    checkin_date: { $gt: endDate },
                    checkout_date: { $gt: endDate }
                }
            ]
        })
           
} catch (err) { console.log(err.message); }
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
    findOverlapping,
    findUserHistory

}




