const bcrypt = require('bcryptjs')
const userRepository = require('../repository/userRepository')
const User = require('../domain/model/user')
const bookings = require('../domain/model/bookings')

const sendMail = require('../utils/mailer')
const generatedOtp = require('../utils/otpGenerator')

const findHotels = async (req) => {
    try {
        const cityName = req.body.city
        
        console.log(req.body,"body");
        let hotelsData
        if (req.session.city) {
            const city = req.session.city
            console.log(city,"city in session");
            let hotelsData = await userRepository.findAllHotels(city)
            if (hotelsData.length === 0) {
                const msg = "No hotels in found in the city"
                delete req.session.city
                return { status: 400, msg }
            }
            delete req.session.city
            return hotelsData
        }
        req.session.city = cityName
        hotelsData = await userRepository.findAllHotels(cityName)
        if (!hotelsData) {
            const msg = "Something went wrong"
            return { status: 400, msg }
        }

        return hotelsData
    } catch (err) { console.log(err); }
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
    req.session.otpExpire=Date.now()+ 10*60*1000

    const { email } = req.session?.userFormData
   
    console.log(otp, 'otp');
    sendMail(email, otp)
}

const otpAuth = async (req) => {
    const genOtp = req.session.otp
    console.log(req.body.otp);


    console.log(genOtp);
    if (req.body.otp === genOtp) {
        if(Date.now() <req.session.otpExpire){
            console.log(Date.now);
            delete req.session.otp
            return { status: 200 }
        }
        else{
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
            if(req.session.hotelId) return {status:202}
            return { status: 200 }
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

// const generateOtpAndSendToVerifyEmail = (req,res) => {
//     const otp = generatedOtp()
//     req.session.otp = otp
//     const email = req.session.user
//     console.log(otp, 'otpNew');
//     sendMail(email, otp)

// }

// const saveEditedUserPassword= async (req)=>{
//    try{
//         console.log(req);
//         const genOtp = req.session.otp
//         console.log(req.body.otp +'#####');
//         console.log(genOtp +"@@@@2");
//         // if (req.body.otp === genOtp) {

//         const {password,confirm}=req.body
//         if(req.body.otp === genOtp){
//          if(password === confirm)   {

//             const updateData= await userRepository.findAndEditPassword(req)
//             if( updateData ){
//                 const msg = "New password added"
//                 delete req.session.otp
//                 return { status: 200, msg }

//             } else{
//                 const msg = "Something went wrong"
//                 return { status: 500, msg }

//             }}

//         } else {
//             const msg='Entered password does not match'
//             return { status: 400 ,msg}
//         }

//        }catch(err){console.log(err);}
// }


const saveEditedUserPassword = async (req) => {
    try {

        const { password, confirm } = req.body
        if (password === confirm) {

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
            const msg = 'Entered password does not match'
            return { status: 400, msg }
        }
    } catch (err) { console.log(err); }
}

const generateOtpAndSendForForgot = async (req) => {
    try {
        let { email } = req.body
        
        //resend otp
        if(req.session.email){
            const otp = generatedOtp()
            email=req.session.email
        req.session.otp = otp
        req.session.otpExpire=Date.now()+ 10*60*1000
        console.log(otp, 'otp');

        sendMail(email, otp)
        return {status:202}
        }

        const checkUserExists = await userRepository.findUserByEmail(email)
        console.log(checkUserExists);
        if (!checkUserExists) {
            const msg = "In this email no user exists"
            return { status: 202, msg }
        }
        const otp = generatedOtp()
        req.session.otp = otp
        req.session.otpExpire=Date.now()+ 10*60*1000
        console.log(req.session.otpExpire);
        req.session.email = email
        console.log(otp, 'otp');

        sendMail(email, otp)
        return {status:200}
    } catch (err) { console.log(err); }
}

const authAndSavePassword = (req) => {
    const genOtp = req.session.otp
    console.log(req.body.otp);
    console.log(genOtp);
    if (req.body.otp === genOtp) {
        if(Date.now() <req.session.otpExpire){
            console.log(Date.now);
            delete req.session.otp
            return { status: 200 }
        }
        else{
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

const saveBooking = async (req) => {
    try {
        const { name, email, phone } = req.body
        const roomData = req.session.roomData
        const hotelData = req.session.hotelData
        const hotel_id = hotelData._id
        const room_id=roomData._id
        const checkin_date = req.session.checkin_date
        const checkout_date = req.session.checkout_date
        console.log(checkin_date, '====', checkout_date);

        const user = req.session.user


        // function convertDateFormat(inputDate) {
        //     const months = {
        //         January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
        //         July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
        //     };
        //     const parts = inputDate.split(" ");
        //     const day = parseInt(parts[0], 10);
        //     const monthNew = parts[1].split(",")
        //     const month = months[monthNew[0]];
        //     const year = parseInt(parts[2], 10);
        //     console.log(`${day} ${month} ${year}`);
        //     return `${year}-${month}-${day}`
        // // }
        // const Newcheckin_date = convertDateFormat(checkin_date)
        // const Newcheckout_date = convertDateFormat(checkout_date);
        const startTime = 'T09:30:00.000Z';
        const endTime = 'T06:30:00.000Z';
        const startDateString=checkin_date + startTime
        const endDateString=checkout_date + endTime

        const startDate=new Date(startDateString)
        const endDate=new Date(endDateString)

        console.log(startDate, endDate,startDateString,endDateString,checkin_date,checkout_date,"<<<<<<<")


        let selectedRoom = await userRepository.selectedRoom(roomData)
        let roomNumber = selectedRoom.roomNumbers[0]

        if (roomNumber) await userRepository.removeRoomNumber(roomData)
        else {
            let availableRooms = await userRepository.findAvailableRooms(startDate, endDate,hotel_id,room_id)
            const availableRoomNumber = availableRooms.map((room) => { return room.roomNumber })

            console.log(startDate, endDate,hotel_id,room_id)

            roomNumber = availableRoomNumber[0]
            const verifyRoom= await userRepository.findOverlapping(startDate, endDate,hotel_id,room_id)
            const verifiedRooms= verifyRoom.map((room) => { return room.roomNumber })
            console.log(verifyRoom,'??????');
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
        const msg = "Room booked sucessfully"
        return { status: 200, msg }

    } catch (err) { console.log(err); }
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
    // generateOtpAndSendToVerifyEmail,
    saveEditedUserPassword,
    generateOtpAndSendForForgot,
    authAndSavePassword,
    changePassord,
    sortHotels,
    roomDetails,
    roomImages,
    selectedRoom,
    saveBooking
}