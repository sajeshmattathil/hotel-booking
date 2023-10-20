const bcrypt = require('bcryptjs')
const userRepository = require('../repository/userRepository')
const ownerRepository = require('../repository/ownerRepository')
const adminRepository = require('../repository/adminRepository')
const User = require('../domain/model/user')
const bookings = require('../domain/model/bookings')
const bookingHistory = require('../domain/model/bookingHistory')
const sendMail = require('../utils/mailer')
const generatedOtp = require('../utils/otpGenerator')
const referalCodeGenerator = require('../utils/referalCodeGenerator')

const findHotels = async (city) => {
    try {
        if (city) {
            let hotelsData = await userRepository.findAllHotels(city)
            if (!hotelsData.length) {
                const msg = "No hotels in found in the city"
                delete req.session.city
                return { status: 400, msg }
            }
            return hotelsData
        }


        return hotelsData
    } catch (err) { console.log(err.message); }
}

const auth = async (req) => {
    try {
        console.log(req.body);
        const { email, password } = req.body
        if (!email && !password) {
            const msg = 'email or password is missing'
            return { status: 403, msg: msg }
        }

        const user = await userRepository.findUserByEmail(email)
        console.log(user);
        if (!user) {
            const msg = 'No user exists'
            return { status: 400, msg: msg }
        }
        const checkedPassword = await bcrypt.compare(password, user.password)

        if (user && checkedPassword) {
            if (user.isUser) {
                req.session.user = email;
                return { status: 200 }
            }
        }
        else if (!user) {
            const msg = 'No user exists'
            return { status: 400, msg: msg }
        }
        else {
            const msg = 'Password is incorrect'
            return { status: 400, msg: msg }
        }
    } catch (error) {
        console.log(error);
    }
}


const generateOtpAndSend = (req) => {
    const otp = generatedOtp()
    req.session.otp = otp
    req.session.otpExpireForRegister = Date.now() + 10 * 60 * 1000

    const { email } = req.session?.userFormData

    console.log(otp, 'otp');
    sendMail(email, otp)
}

const otpAuth = async (req) => {
    const genOtp = req.session.otp
    console.log(req.body.otp);


    console.log(genOtp);
    if (req.body.otp === genOtp) {
        if (Date.now() < req.session.otpExpireForRegister) {
            console.log(Date.now);
            delete req.session.otp
            return { status: 200 }
        }
        else {
            const msg = 'OTP expired'
            return { status: 400, msg }
        }
    } else {
        const msg = 'Entered OTP is wrong'
        return { status: 400, msg }
    }
}


const userAuthentication = async (req) => {
    const userData = req.session.userFormData
    try {
        const { first_name, last_name, email, mobile, password, referal } = userData;
        console.log(referal, ".,.,><><");
        var referalMoney = 0
        const existingUserData = await userRepository.findUserByEmail(email);

        if (existingUserData) {
            console.log('User with this email already exists');
            const msg = "User with this email already exists"
            return { status: 400, msg };
        }
        if (referal) { var verifyReferal = await userRepository.findUserByReferal(referal) }
        // else{}
        console.log(verifyReferal, "jhgjhgjhg");

        if (verifyReferal) {
            await userRepository.updateReferalForExistinUser(verifyReferal._id)
            referalMoney = 50

        }
        const referalCode = referalCodeGenerator()
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            first_name,
            last_name,
            email,
            mobile,
            password: hashPassword,
            referal: {
                referalCode: referalCode,
                referalMoney: referalMoney
            }
        });
        newUser.save()
        const walletMoney = await userRepository.updateNewUserWallet(email)

        delete req.session.userFormData
        if (newUser) {
            if (req.session.hotelId) return { status: 202 }
            const msg = "You got a welcome bonus ₹ 100"
            return { status: 200, msg }
        } else {
            const msg = "Something went wrong"
            return { status: 400, msg };
        }

    } catch (error) {
        console.log(error);
        const msg = "Some internal error"
        return { status: 500, msg };
    }
}
const verifyUser = async (userData) => {

    try {
        const { first_name, last_name, email, mobile, password, confirm, referal } = userData;
        if (!first_name || !last_name || !email || !mobile || !password || !confirm) {
            console.log('Fill in empty fields');
            const msg = 'Fill in empty fields'
            return { status: 400, msg: msg };
        }

        // Confirm password
        if (password !== confirm) {
            console.log('Passwords must match');
            const msg = 'Passwords must match'
            return { status: 400, msg: msg };
        }
        if (referal) {
            var verifyReferal = await userRepository.findUserByReferal(referal)
            if (!verifyReferal) {
                const msg = "No user found in this referal"
                return { status: 400, msg };

            }
        }

        const user = await userRepository.findUserByEmail(email)
        if (user) {
            const msg = 'User already exists'
            return { status: 200, msg: msg }
        } else {
            const msg = ''
            return { status: 202, msg: msg }
        }



    } catch (error) { console.log(error); }
}

const userDetails = async (req) => {
    try {
        const email = req.session.user
        const userData = await userRepository.findUserByEmail(email)
        if (userData) return userData
        else {
            const msg = 'Something went wrong'
            return { status: 400, msg }
        }

    } catch (err) { console.log(err); }
}
const saveEditedUserName = async (req) => {
    try {

        const updateData = await userRepository.findAndEditName(req)
        if (updateData) {
            const msg = "Name edited"
            return { status: 200, msg }

        } else {
            const msg = "Something went wrong"
            return { status: 500, msg }

        }
    } catch (err) { console.log(err); }
}
const saveEditedUserEmail = async (req) => {
    try {

        const updateData = await userRepository.findAndEditEmail(req)
        if (updateData) {
            const msg = "Email edited"
            return { status: 200, msg }

        } else {
            const msg = "Something went wrong"
            return { status: 500, msg }

        }
    } catch (err) { console.log(err); }
}

const saveEditedUserMobile = async (req) => {
    try {

        const updateData = await userRepository.findAndEditMobile(req)
        if (updateData) {
            const msg = "Phone number edited"
            return { status: 200, msg }

        } else {
            const msg = "Something went wrong"
            return { status: 500, msg }

        }
    } catch (err) { console.log(err); }
}

const saveEditedUserGender = async (req) => {
    try {
        console.log(req.session.otp + "000000");
        const updateData = await userRepository.findAndEditGender(req)
        if (updateData) {
            const msg = "Gender added"
            return { status: 200, msg }

        } else {
            const msg = "Something went wrong"
            return { status: 500, msg }

        }
    } catch (err) { console.log(err); }
}

const saveEditedUserAddress = async (req) => {
    try {

        const updateData = await userRepository.findAndEditAddress(req)
        if (updateData) {
            const msg = "Address added"
            return { status: 200, msg }

        } else {
            const msg = "Something went wrong"
            return { status: 500, msg }

        }
    } catch (err) { console.log(err); }
}




const saveEditedUserPassword = async (req) => {
    try {

        const { old_password } = req.body

        const email = req.session.user
        const user = await userRepository.findUserByEmail(email)
        const verifyOldPassword = await bcrypt.compare(old_password, user.password)
        if (verifyOldPassword) {

            const updateData = await userRepository.findAndEditPassword(req)
            if (updateData) {
                const msg = "New password added"
                delete req.session.otp
                return { status: 200, msg }

            } else {
                const msg = "Something went wrong"
                return { status: 500, msg }
            }
        } else {
            const msg = 'Old password does not match'
            return { status: 400, msg }
        }


    } catch (err) { console.log(err); }
}

const generateOtpAndSendForForgot = async (req) => {
    try {
        let { email } = req.body

        //resend otp
        if (req.session.email) {
            const otp = generatedOtp()
            email = req.session.email
            req.session.otp = otp
            req.session.otpExpire = Date.now() + 10 * 60 * 1000
            console.log(otp, 'otp');

            sendMail(email, otp)
            return { status: 202 }
        }

        const checkUserExists = await userRepository.findUserByEmail(email)
        console.log(checkUserExists);
        if (!checkUserExists) {
            const msg = "In this email no user exists"
            return { status: 202, msg }
        }
        const otp = generatedOtp()
        req.session.otp = otp
        req.session.otpExpire = Date.now() + 10 * 60 * 1000
        console.log(req.session.otpExpire);
        req.session.email = email
        console.log(otp, 'otp');

        sendMail(email, otp)
        return { status: 200 }
    } catch (err) { console.log(err); }
}

const authAndSavePassword = (req) => {
    const genOtp = req.session.otp
    console.log(req.body.otp);
    console.log(genOtp);
    if (req.body.otp === genOtp) {
        if (Date.now() < req.session.otpExpire) {
            console.log(Date.now);
            delete req.session.otp
            return { status: 200 }
        }
        else {
            const msg = 'OTP expired'
            return { status: 400, msg }
        }
    } else {
        const msg = 'Entered OTP is wrong'
        return { status: 400, msg }
    }
}

const changePassord = async (req) => {
    try {
        const { password, confirm } = req.body
        if (password === confirm) {
            const updatePassword = await userRepository.findAndChangePassword(req)
            if (updatePassword) {
                console.log(updatePassword);
                const msg = "Password changed sucessfully"
                return { status: 200, msg }
            } else {
                const msg = "Something went wrong"
                return { status: 500, msg }
            }
        } else {
            const msg = 'Password doesnot match'
            return { status: 400, msg }
        }
    } catch (err) { console.log(err); }
}

const sortHotels = async (req) => {
    const sortedData = await userRepository.sortBy(req)
    if (sortedData.length === 0) {
        const commonData = await findHotels(req)
        return commonData
    }
    return sortedData

}

const filteredData = async (req) => {
    try {
        // const {amenities,star_rating}
        const data = await userRepository.filerHotels()
    } catch (err) { console.log(err); }
}

const roomDetails = async (req) => {
    try {
        const hotelId = req.session.hotelId
        const roomsData = await userRepository.roomDetails(hotelId)
        return roomsData
    } catch (err) { console.log(err); }
}

const roomImages = async (req) => {

    try {
        const hotelId = req.session.hotelId
        const images = await userRepository.roomImages(hotelId)
        return images
    } catch (err) { console.log(err); }
}

const checkRoomAvailability = async (req) => {
    try {
        const roomData = req.session.roomData
        const hotelData = req.session.hotelData
        const hotel_id = hotelData._id
        const room_id = roomData._id
        const startDate = req.session.checkin_date
        const endDate = req.session.checkout_date
        console.log(hotel_id, room_id, startDate, endDate, "+++++-----");

        let selectedRoom = await userRepository.selectedRoom(roomData)
        var roomNumber = selectedRoom.roomNumbers[0]
        if (roomNumber) await userRepository.removeRoomNumber(roomData)

        else {

            var roomNumberArray = await userRepository.findAllRoomNumber()
            console.log(roomNumberArray, "All room numbers");

            let bothStartEndOverlaps = await userRepository.bothStartEndOverlaps(startDate, endDate, hotel_id, room_id)
            const bothStartEndOverlapsRooms = bothStartEndOverlaps.map((room) => { return room.roomNumber })
            console.log(bothStartEndOverlapsRooms, "Room numbers having both startDate, endDate inside ");

            if (bothStartEndOverlapsRooms.length) {
                roomNumberArray = roomNumberArray.filter(item => !bothStartEndOverlapsRooms.includes(item));
                console.log(roomNumberArray, "After first filtering");
            }

            let onlyEndOverlaps = await userRepository.onlyEndOverlaps(startDate, endDate, hotel_id, room_id)
            const onlyEndOverlapsRooms = onlyEndOverlaps.map((room) => { return room.roomNumber })
            console.log(onlyEndOverlapsRooms, "Room numbers having only endDate inside");

            if (onlyEndOverlapsRooms.length) {
                roomNumberArray = roomNumberArray.filter(item => !onlyEndOverlapsRooms.includes(item));
                console.log(roomNumberArray, "After second filtering ");
            }

            let onlyStartOverlaps = await userRepository.onlyStartOverlapsRooms(startDate, endDate, hotel_id, room_id)
            const onlyStartOverlapsRooms = onlyStartOverlaps.map((room) => { return room.roomNumber })
            console.log(onlyStartOverlapsRooms, "Room numbers having only endDate inside");

            if (onlyStartOverlapsRooms.length) {
                roomNumberArray = roomNumberArray.filter(item => !onlyStartOverlapsRooms.includes(item));
                console.log(roomNumberArray, "After final filtering");
            }       
    }
    if (!roomNumberArray.length) {
        const msg = "No rooms available,select another room"
                return {msg}
        }else {
            const msg = " "
            return {msg}
        }
    } catch (err) { console.log(err); }
}

const selectedRoom = async (req, res) => {
    try {
        const roomType = req.session.roomType
        const hotelId = req.session.hotelId

        console.log(hotelId);

        const selectedHotel = await userRepository.selectedHotelDetails(hotelId)
        const selectedRoom = await userRepository.selectedRoomDetails(roomType)

        return { selectedHotel, selectedRoom }
    } catch (err) { console.log(err); }
}

const findCoupons = async (req) => {
    try {
        const email = req.session.user
        const couponData = await userRepository.findCouponByUser(email)
        if (couponData.length > 0) return couponData
        else if (!couponData.length) {
            const couponMsg = "No coupons available"
            return couponMsg
        }
        else {
            const couponMsg = "No coupons available"
            return couponMsg
        }

    } catch (err) { console.log(err); }
}

const findWalletMoney = async (req) => {
    try {
        const email = req.session.user
        const walletMoney = await userRepository.findWalletMoney(email)
        return walletMoney

    } catch (err) { console.log(err); }
}


const saveBooking = async (req) => {
    try {

        if (req.query.param) {
            var paymentMode = "razorpay"
            var moneyPaid = req.query.param / 100
            var moneyFromWallet = req.session.walletMoneyUsed
        } else {
            var paymentMode = "offline"
            var moneyPaid = 0
            var moneyFromWallet = req.session.walletMoneyUsed

        }
        if (req.session.couponSelected) var couponUsed = req.session.couponSelected
        else couponUsed = 0

        const totalAmount = req.session.totalAmount
        const numberOfDays = req.session.numberOfDays   

        if (paymentMode === "offline") var pendingAmount = totalAmount;
        else pendingAmount = 0

        console.log(pendingAmount,"pendingAmount")

        const { name, email, phone } = req.session.booking
        const roomData = req.session.roomData
        const hotelData = req.session.hotelData
        const hotel_id = hotelData._id
        const room_id = roomData._id
        const checkin_date = req.session.checkin_date
        const checkout_date = req.session.checkout_date
        console.log(checkin_date, '====', checkout_date);

        const user = req.session.user
        const offer = req.session.offer
        const startTime = 'T15:00:00.000Z';
        const endTime = 'T12:00:00.000Z';
        const startDateString = checkin_date + startTime
        const endDateString = checkout_date + endTime

        const startDate = new Date(startDateString)
        const endDate = new Date(endDateString)

        let selectedRoom = await userRepository.selectedRoom(roomData)
        var roomNumber = selectedRoom.roomNumbers[0]
        if (roomNumber) await userRepository.removeRoomNumber(roomData)
        else {


            var roomNumberArray = await userRepository.findAllRoomNumber()
            console.log(roomNumberArray, "All room numbers");

            let bothStartEndOverlaps = await userRepository.bothStartEndOverlaps(startDate, endDate, hotel_id, room_id)
            const bothStartEndOverlapsRooms = bothStartEndOverlaps.map((room) => { return room.roomNumber })
            console.log(bothStartEndOverlapsRooms, "Room numbers having both startDate, endDate inside ");

            if (bothStartEndOverlapsRooms.length) {
                roomNumberArray = roomNumberArray.filter(item => !bothStartEndOverlapsRooms.includes(item));
                console.log(roomNumberArray, "After first filtering");
            }

            let onlyEndOverlaps = await userRepository.onlyEndOverlaps(startDate, endDate, hotel_id, room_id)
            const onlyEndOverlapsRooms = onlyEndOverlaps.map((room) => { return room.roomNumber })
            console.log(onlyEndOverlapsRooms, "Room numbers having only endDate inside");

            if (onlyEndOverlapsRooms.length) {
                roomNumberArray = roomNumberArray.filter(item => !onlyEndOverlapsRooms.includes(item));
                console.log(roomNumberArray, "After second filtering ");
            }

            let onlyStartOverlaps = await userRepository.onlyStartOverlapsRooms(startDate, endDate, hotel_id, room_id)
            const onlyStartOverlapsRooms = onlyStartOverlaps.map((room) => { return room.roomNumber })
            console.log(onlyStartOverlapsRooms, "Room numbers having only endDate inside");

            if (onlyStartOverlapsRooms.length) {
                roomNumberArray = roomNumberArray.filter(item => !onlyStartOverlapsRooms.includes(item));
                console.log(roomNumberArray, "After final filtering");
            }

            if (roomNumberArray.length) {
                roomNumber = roomNumberArray[0]
                console.log(roomNumber, "selected room");
            } else {
                const msg = "No rooms available"
                return { status: 202, msg }
            }

        }

        const newBooking = new bookings({
            userName: user,
            name: name,
            roomNumber,
            email,
            mobile: phone,
            hotel_id,
            room_id: roomData._id,
            checkin_date: startDate,
            checkout_date: endDate,
            status: 'pending',
            otherDetails: {
                paymentMode,
                couponUsed,
                moneyPaid,
                moneyFromWallet,
                pendingAmount
            }

        })
        newBooking.save()
        console.log(newBooking._id, "newBooking...");


        const newBookingHistory = new bookingHistory({
            userName: user,
            name: name,
            roomNumber,
            booking_id: newBooking._id,
            email,
            hotel_id,
            room_id: roomData._id,
            checkin_date: startDate,
            checkout_date: endDate,
            status: 'pending',
            otherDetails: {
                paymentMode,
                couponUsed,
                moneyPaid,
                moneyFromWallet,
                pendingAmount
            }
        })
        newBookingHistory.save()
        console.log(newBookingHistory, "newBookingHistory...");

        await userRepository.updateUserWallet(user, moneyFromWallet)

        if (paymentMode === "razorpay") {

            const ownerAmount = totalAmount - (totalAmount * .30) - couponUsed -(roomData.price * .12 * numberOfDays)

            console.log(ownerAmount, "ownerAmount");


            const updateOwnerWallet = await ownerRepository.updateOwnerWallet(hotel_id, newBookingHistory._id, ownerAmount)
            console.log(updateOwnerWallet, "updateOwnerWallet");

            const adminAmount = totalAmount - (totalAmount * .70) - (roomData.price * .12 * numberOfDays)
            console.log(adminAmount,"adminAmount");

         

            const updateAdminWallet = await adminRepository.updateAdminWallet(adminAmount)
            console.log(updateAdminWallet, "updateAdminWallet");
        }

        const msg = "Room booked sucessfully"
        return { status: 200, msg }

    } catch (err) { console.log(err); }
}

const findBookings = async (email) => {
    try {
        const history = await userRepository.findUserHistory(email)
        if (history) return history
        else {
            const msg = "No bookings done ,Book now grab offers"
            return { msg }
        }
    } catch (err) { console.log(err.message); }
}


const findCategoryOffer = async (req) => {
    try {
        const roomData = req.session.roomData
        const offer = await userRepository.findOffers(roomData.roomType)
        return offer
    } catch (err) { console.log(err); }
}



const cancelBooking = async (req) => {
    try {
        const bookingId = req.params.id
        const bookingDetails = await userRepository.bookingDetails(bookingId)
        const moneyFromWallet = bookingDetails.otherDetails.moneyFromWallet
        const userName = bookingDetails.userName
        await userRepository.updateUserWalletAdd(userName, moneyFromWallet)
        const roomNumber = bookingDetails.roomNumber
        const bookingsWithSameRoom = await userRepository.findAllBookingsWithRoomNumber(roomNumber)
        if (bookingsWithSameRoom.length == 1) {
            const room_id = bookingDetails.room_id
            await userRepository.updateRoomNumberArray(room_id, roomNumber)
        }
        await userRepository.findAndUpdateHistory(bookingId)
        await userRepository.findAndDelete(bookingId)
        const msg = "Booking deleted sucessfully"
        return { status: 200, msg }
    } catch (err) { console.log(err); }
}

const updateFinishedBooking = async ()=>{
    try{
        let timer
     const timerFor =async  ()=>{
             const millisecondsOf24Hr =   5000              //24 * 60 * 60 * 1000
         timer =   setInterval( async ()=>{
            const findBookingsForUpdation = await userRepository.findBookingsForUpdation()
            console.log(findBookingsForUpdation,"findBookingsForUpdation")
            if(findBookingsForUpdation.length){
                
                findBookingsForUpdation.forEach(async (booking)=>{
                    if(booking.otherDetails.pendingAmount){
                        const response = await userRepository.updatePendingMoney(booking._id,booking.otherDetails.pendingAmount)
                        console.log(booking._id,booking.otherDetails.pendingAmount,"response");
                        console.log(response,"response");
                    }
                })
                
                const result1 = await userRepository.findAndUpdateAllHistory()
                const result2 =  await userRepository.findAndDeleteAll()
              

                console.log(result1,result2,"updating");
            }

        },millisecondsOf24Hr)
     }
     timerFor()
     function stopTimer() {
        clearInterval(timer);
        console.log('Timer stopped.');
    }
    setTimeout(stopTimer, 5000);
    }catch(err){console.log(err);}
}

module.exports = {
    userAuthentication,
    verifyUser,
    generateOtpAndSend,
    auth,
    otpAuth,
    findHotels,
    userDetails,
    saveEditedUserName,
    saveEditedUserEmail,
    saveEditedUserMobile,
    saveEditedUserGender,
    saveEditedUserAddress,
    saveEditedUserPassword,
    generateOtpAndSendForForgot,
    authAndSavePassword,
    changePassord,
    sortHotels,
    roomDetails,
    roomImages,
    checkRoomAvailability,
    selectedRoom,
    saveBooking,
    findBookings,
    findCoupons,
    findCategoryOffer,
    
    findWalletMoney,
    cancelBooking,
    updateFinishedBooking
}