const bcrypt = require('bcryptjs')
const userRepository = require('../repository/userRepository')
const User = require('../domain/model/user')
const bookings = require('../domain/model/bookings')
const history = require('../domain/model/bookingHistory')
const sendMail = require('../utils/mailer')
const generatedOtp = require('../utils/otpGenerator')

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
        const { first_name, last_name, email, mobile, password, confirm } = userData;

        const existingUserData = await userRepository.findUserByEmail(email);

        if (existingUserData) {
            console.log('User with this email already exists');
            const msg = "User with this email already exists"
            return { status: 400, msg };
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            first_name,
            last_name,
            email,
            mobile,
            password: hashPassword
        });
        newUser.save()
        delete req.session.userFormData
        if (newUser) {
            if (req.session.hotelId) return { status: 202 }
            const msg="You are now a user,redeem offers"
            return { status: 200,msg }
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
        const { first_name, last_name, email, mobile, password, confirm } = userData;
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
        else {
            const couponMsg = "No coupons available"
            return couponMsg
        }

    } catch (err) { console.log(err); }
}

const saveBooking = async (req) => {
    try {
        const { name, email, phone } = req.session.booking
        const roomData = req.session.roomData
        const hotelData = req.session.hotelData
        const hotel_id = hotelData._id
        const room_id = roomData._id
        const checkin_date = req.session.checkin_date
        const checkout_date = req.session.checkout_date
        console.log(checkin_date, '====', checkout_date);

        const user = req.session.user

        const startTime = 'T15:00:00.000Z';
        const endTime = 'T12:00:00.000Z';
        const startDateString = checkin_date + startTime
        const endDateString = checkout_date + endTime

        const startDate = new Date(startDateString)
        const endDate = new Date(endDateString)



        let selectedRoom = await userRepository.selectedRoom(roomData)
        let roomNumber = selectedRoom.roomNumbers[0]
        if (roomNumber) await userRepository.removeRoomNumber(roomData)
        else {
            let availableRooms = await userRepository.findAvailableRooms(startDate, endDate, hotel_id, room_id)
            const availableRoomNumber = availableRooms.map((room) => { return room.roomNumber })
            console.log(availableRoomNumber,"{}{}{}{}{");

            roomNumber = availableRoomNumber[0]
            const verifyRoom = await userRepository.findOverlapping(startDate, endDate, hotel_id, room_id)
            const verifiedRooms = verifyRoom.map((room) => { return room.roomNumber })
            console.log(verifiedRooms, '??????');

            const roomNumberArray = await userRepository.findAllRoomNumber()
            console.log(roomNumberArray, "555555");
            const choosenRoom = roomNumberArray.find((number) => {
                return !availableRoomNumber.includes(number)
            })

            if (choosenRoom) {
                roomNumber = choosenRoom
                console.log(choosenRoom, "[][][");
            }
            else{
                    console.log(roomNumber, "[lkjknj]");

                    const msg = "No rooms available"
                    return { status: 202, msg }
                }
            
        }

        const newBooking = new bookings({
            userName: user,
            name: name,
            roomNumber,
            email,
            hotel_id,
            room_id: roomData._id,
            checkin_date: startDate,
            checkout_date: endDate,
            status: 'pending'

        })
        newBooking.save()
        const newBookingHistory = new history({ ...newBooking })
        newBookingHistory.save()
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


const findCategoryOffer = async () =>{
    try{
        
        const offers = await userRepository.findOffers()
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
    selectedRoom,
    saveBooking,
    findBookings,
    findCoupons,
    findCategoryOffer
}