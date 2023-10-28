const bcrypt = require('bcryptjs')
const userRepository = require('../repository/userRepository')
const ownerRepository = require('../repository/ownerRepository')
const adminRepository = require('../repository/adminRepository')
const User = require('../domain/model/user')
const bookings = require('../domain/model/bookings')
const bookingHistory = require('../domain/model/bookingHistory')
const wallet = require('../domain/model/wallet')
const sendMail = require('../utils/mailer')
const generatedOtp = require('../utils/otpGenerator')
const referalCodeGenerator = require('../utils/referalCodeGenerator')
const invoiceNum = require('../utils/invoiceNumber')
const { ObjectId } = require('mongodb');

const findHotels = async (city) => {
    try {
        if (city) {
            let hotelsData = await userRepository.findAllHotels(city)
            if (!hotelsData.length) {
                const msg = "No hotels in found in the city"
                req.session.city
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

    const { currentEmail } = req.body

    console.log(otp, 'otp');
    sendMail(currentEmail, otp)
    return {status:200}
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
        const userId = newUser._id
        const today = Date.now()
        const transaction = new wallet({
            transaction_id:userId,
            amount:50 + referalMoney,
            transaction_type:"credit",
            date:today
        }) 
        transaction.save()

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
        console.log(2);
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


const generateOtpAndSendForEmailChange = (req) => {
    const otp = generatedOtp()
    req.session.otpForChangeEmail = otp
    req.session.otpExpireForChangeEmail = Date.now() + 10 * 60 * 1000

    const { currentEmail } = req.body

    console.log(otp, 'otp');
    sendMail(currentEmail, otp)
    return {status:200}
}
const veriftOtpForChangeEmail = (req)=>{
    try{
      const {otp} = req.body
      console.log(otp,"otp");

      console.log(req.session.otpForChangeEmail,req.session.otpExpireForChangeEmail,"req.session.otpExpireForChangeEmail");

      if(Date.now() <req.session.otpExpireForChangeEmail){
        if(otp ===  req.session.otpForChangeEmail ) return {status:200}
        else  {
            console.log(1);
            const msg = "You enteres a wrong otp"
            return {statud :203,msg}
        }
      }else{
        console.log(2);

        const msg = "Time expired,try again"
        return {statud :204,msg}
      }
    }catch(err){console.log(err.message);}
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




const saveEditedUserPassword = async (req,res) => {
    try {

        const { oldPassword } = req.body

        const email = req.session.user
        const user = await userRepository.findUserByEmail(email)
        const verifyOldPassword = await bcrypt.compare(oldPassword, user.password)
        if (verifyOldPassword) {

            const updateData = await userRepository.findAndEditPassword(req)
            if (updateData) {
                const errorMsg = "New password added sucessfully"
                delete req.session.otp
            return res.json({ error: errorMsg });

            } else {
                const msg = "Something went wrong"
                return { status: 500, msg }
            }
        } else {
           // const msg = 'Old password does not match'
           console.log('last');
            const errorMsg = 'Old password does not match';
            return res.json({ error: errorMsg });
           // return { status: 400, msg }
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

const filteredData = async (body, place) => {
    try {
        let data
        let { amenities, star_rating } = body
        console.log(body, "body");
        let city = place
        if (amenities && star_rating) {
            console.log(amenities, star_rating, "amenities && star_rating");
            data = await userRepository.filerHotels(city, body)
            return { data }

        } else if (!amenities && !star_rating) return { status: 202 }
        else {
            data = await userRepository.filerHotelsifOneMissing(city, amenities, star_rating)
            return { data }
        }


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
        let selectedRoom = await userRepository.selectedRoom(roomData)
        var roomNumber = selectedRoom.roomNumbers[0]
        var roomNumberArray = await userRepository.findAllRoomNumber()
        if (roomNumber) await userRepository.removeRoomNumber(roomData)     
        else {
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
        console.log(roomNumberArray, "roomNumberArray");
        if (!roomNumberArray.length) {
            const msg = "No rooms available,select another room"
            return { msg }
        } else {
            const msg = " "
            return { msg }
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

        console.log(pendingAmount, "pendingAmount")

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
            invoice_number: '',
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
            invoice_number: '',
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

       if(moneyFromWallet){
        const userDetails = await userRepository.findUserByEmail(user)
        const userId = userDetails._id
        const today = Date.now()
        const transaction = new wallet({
            transaction_id:userId,
            amount:moneyFromWallet,
            transaction_type:"debit",
            date:today
        }) 
        transaction.save()
       }

        if (paymentMode === "razorpay") {

            const ownerAmount = totalAmount - (totalAmount * .30) - couponUsed - (roomData.price * .12 * numberOfDays)

            console.log(ownerAmount, "ownerAmount");

            const updateOwnerWallet = await ownerRepository.updateOwnerWallet(hotel_id, newBookingHistory._id, ownerAmount)
            console.log(updateOwnerWallet, "updateOwnerWallet");
            const ownerId = hotelData.owner_id
            let today = Date.now()
            let transaction = new wallet({
                transaction_id:ownerId,
                amount:ownerAmount,
                transaction_type:"credit",
                date:today
            }) 
            transaction.save()

            const adminAmount = totalAmount - (totalAmount * .70) - (roomData.price * .12 * numberOfDays)
            console.log(adminAmount, "adminAmount");

            const updateAdminWallet = await adminRepository.updateAdminWallet(adminAmount)
            console.log(updateAdminWallet, "updateAdminWallet");
            const adminData = await adminRepository.findAdmin()
            const adminId = adminData[0]._id
                today = Date.now()

                transaction = new wallet({
                transaction_id:adminId,
                amount:adminAmount,
                transaction_type:"credit",
                date:today
            }) 
            transaction.save()
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
        console.log(bookingDetails, "bookingDetails");
        const refundMoney = bookingDetails.otherDetails.moneyFromWallet + bookingDetails.otherDetails.moneyPaid
        const userName = bookingDetails.userName
        await userRepository.updateUserWalletAdd(userName, refundMoney)

        const user = await userRepository.findUserByEmail(userName)
        const userId = user._id
        const today = Date.now()
        const transaction = new wallet({
            transaction_id:userId,
            amount:refundMoney,
            transaction_type:"credit",
            date:today
        }) 
        transaction.save()
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

const updateFinishedBooking = async () => {
    try {
        let timer
        const timerFor = async () => {
            const millisecondsOf24Hr = 24 * 60 * 60 * 1000              //
            timer = setInterval(async () => {
                const findBookingsForUpdation = await userRepository.findBookingsForUpdation()
                console.log(findBookingsForUpdation, "findBookingsForUpdation")
                if (findBookingsForUpdation.length) {

                    findBookingsForUpdation.forEach(async (booking) => {
                        if (booking.otherDetails.pendingAmount) {
                            const response = await userRepository.updatePendingMoney(booking._id, booking.otherDetails.pendingAmount)
                            console.log(booking._id, booking.otherDetails.pendingAmount, "response");
                            console.log(response, "response");
                        }
                    })
                    const result1 = await userRepository.findAndUpdateAllHistory()
                    const result2 = await userRepository.findAndDeleteAll()
                    console.log(result1, result2, "updating");
                }
            }, millisecondsOf24Hr)
        }
        timerFor()
        function stopTimer() {
            clearInterval(timer);
            console.log('Timer stopped.');
        }
        setTimeout(stopTimer, 5000);
    } catch (err) { console.log(err); }
}

const genInvoice = async (req) => {
    try {
        var data
        const bookingId = req.session.invoice
        const getData = await userRepository.bookingDetails(bookingId)
        console.log(getData, "getData");

        if (getData.invoice_number.trim() === '') {
            console.log(1111111);
            var invoiceNumber = invoiceNum()
            console.log(invoiceNumber, "invoiceNumber");
            await userRepository.updateInvoiceNumber(bookingId, invoiceNumber)
            data = await userRepository.findBookingDetail(invoiceNumber)
        } else {

            invoiceNumber = getData.invoice_number
            console.log(invoiceNumber, "invoiceNumber");
            data = await userRepository.findBookingDetail(getData.invoice_number)
        }
        console.log(data, "data");
        if (data && invoiceNumber) return { data, invoiceNumber }
        else {
            const msg = "No invoice found"
            return { status: 201, msg }
        }

    } catch (err) { console.log(err.message); }
}

const findSalesReport = async (data) => {
    try {
        const startDate = new Date(data.checkin_date);
        const endDate = new Date(data.checkout_date);

        const salesData = await userRepository.findSalesData(startDate, endDate)
        if (salesData) return salesData
        else {
            const msg = "No data found"
            return { msg }
        }
    } catch (err) { console.log(err); }
}

const findSalesReportSelected = async (startDate, endDate) => {
    try {
        // const startDate = new Date(data.checkin_date); 
        // const endDate = new Date(data.checkout_date);

        const salesData = await userRepository.findSalesData(startDate, endDate)
        if (salesData) return salesData
        else {
            const msg = "No data found"
            return { msg }
        }
    } catch (err) { console.log(err); }
}
const findWalletTransactions = async (req)=>{
try{
    const email = req.session.user
    const user = await userRepository.findUserByEmail(email)
    const data = await userRepository.findTransactions(user._id)
    console.log(data,"data");
    if(data.length) return data
    else  {
        const msg = "No transactions made"
        return {msg}
    }

}catch(err){console.log(err.message);}
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
    veriftOtpForChangeEmail,
    generateOtpAndSendForEmailChange,
    saveEditedUserMobile,
    saveEditedUserGender,
    saveEditedUserAddress,
    saveEditedUserPassword,
    generateOtpAndSendForForgot,
    authAndSavePassword,
    changePassord,
    sortHotels,
    filteredData,
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
    updateFinishedBooking,
    genInvoice,
    findSalesReport,
    findSalesReportSelected,
    findWalletTransactions
}