const userService = require('../../service/userService')
const invoice = require('../../utils/invoice')


const userHome = (req, res) => {
    // res.render('user/index')
    res.render('user/bookingFinalPage')
    // const checkin_date = req.session.checkin_date
    // const checkout_date = req.session.checkout_date
    //res.render('user/userHome',{checkin_date,checkout_date})
    //res.render('user/invoice')
}
const userhotelsList = async (req, res) => {
console.log(req.body,"req.body");

    const user = req.session.user

    req.session.city = req.body.city
    req.session.num_adults = req.body.adult
    req.session.children = req.body.children
    req.session.checkin_date = req.body.checkin_date
    req.session.checkout_date = req.body.checkout_date

    const hotels = await userService.findHotels(req.session.city)
    if (hotels.status === 400) res.redirect(`/hotelsPage?msg=${hotels.msg}`)
    else res.redirect(`/hotelsPage?msg=${hotels.msg}`)

}
const userhotelsListPage = async (req, res) => {
    let hotels = await userService.findHotels(req.session.city)
    if(req.session.filtered) hotels = req.session.filtered

    const userName = ''
    const user = req.session.user
    const msg = req.query.msg
    res.render('user/hotels', { hotels, msg, userName, user })
}

const userLogin = (req, res) => {
    let msg = req.query.msg
    res.render('user-login', { msg })
    msg = " "
}

const otpVerification = async (req, res) => {
    req.session.userFormData = req.body
    const userData = req.session.userFormData

    const response = await userService.verifyUser(userData)
    if (response.status === 200 || response.status === 400) res.redirect(`/signUp?msg=${response.msg}`)
    else res.redirect('/otpPage')

}
const otpPage = (req, res) => {
    if (!(req.session.otp)) userService.generateOtpAndSend(req)
    const msg = req.query.msg
    res.render('otp', { msg })
}

const otpAuthentication = async (req, res) => {
    const response = await userService.otpAuth(req)
    if (response.status === 200) res.redirect('/register')
    if (response.status === 400) res.redirect(`/otpPage?msg=${response.msg}`)
}

const userLoginHome = async (req, res) => {
    const response = await userService.auth(req)
    if (response.status === 202) res.redirect('/hotelDetailsPage');
    if (response.status === 200) res.redirect('/login/home'); console.log(req.session.user);
    if (response.status === 403) res.redirect(`/login?msg=${response.msg}`)
    if (response.status === 400) res.redirect(`/login?msg=${response.msg}`)

}
const userLoginHomeView = (req, res) => {
    try {
        res.render('user/index')
    } catch (err) { console.log(err); }
}

const userRegister = async (req, res) => {
    const userData = req.session.userFormData
    try {
        let response = await userService.userAuthentication(req)
        if (response.status === 200) res.redirect(`/login?msg=${response.msg}`)
        if (response.status === 400) res.redirect(`/signup?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/otpPage?msg=${response.msg}`)

    } catch (error) { console.log(error); }

}

const userRegisterView = (req, res) => {
    res.redirect('/signUp')
}
const userRegisterPage = (req, res) => {
    const msg = req.query.msg
    const user = req.session.user
    res.render('user-signup', { msg: msg ,user})
}

const signOut = (req, res) => {
    try {
        if (req.session.user) {
            delete req.session.user
            res.redirect('/hotelsPage')
        }
    } catch (err) { console.log(err); }
}

const userManagement = (req, res) => {
    if(req.session.user) res.redirect('/manageYourProfilePage')
    else res.redirect('/login')
}

const userManagementPage = (req, res) => {
    const user = req.session.user

    res.render('user/userManagement',{user})
}

const manageYourProfile = (req, res) => {
    if (!(req.session.user)) res.redirect('/login')
    res.redirect('/manageYourProfilePage')
}
const manageYourProfilePage = async (req, res) => {
    const user = await userService.userDetails(req)
    console.log(user);
    if (user.status === 400) res.redirect(`/manageYourProfilePage?msg=${user.msg}`)
    const msg = req.query.msg
    res.render('user/userProfile', { user, msg })
}
const editUserName = async (req, res) => {
    try {
        const response = await userService.saveEditedUserName(req)
        if (response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    } catch (err) { console.log(err); }
}

const generateOTP = async (req,res)=>{
    try{
       const response = await userService.generateOtpAndSendForEmailChange(req)
       const msg = "Something went wrong"
       if(response.status === 200) res.json({success:true})
       else res.json({msg:msg})
    }catch(err){console.log(err.message);}
}
const verifyOTP = async (req,res)=>{
    try{
        console.log("dsfsgfgfdg");
    const response = await userService.veriftOtpForChangeEmail(req)
    if(response.status === 200) res.json({success:true})
    if(response.status === 203) res.json({msg:response.msg})
    if(response.status === 204) res.json({msg:response.msg})
    }catch(err){console.log(err.message);}
}
// const saveEmail = async (req,res)=>{
//     try{
//         const response = await userService.saveEmail(req)
//     }catch(err){console.log(err.message);}
// }

const saveEmail = async (req, res) => {
    try {
        console.log(1);
        const response = await userService.saveEditedUserEmail(req)
        if (response.status === 200) res.json({success:response.msg})
        if (response.status === 500) res.json({emailError:response.msg})

    } catch (err) { console.log(err); }
}
const editUserMobile = async (req, res) => {
    try {
        const response = await userService.saveEditedUserMobile(req)
        if (response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    } catch (err) { console.log(err); }
}

const editUserGender = async (req, res) => {
    try {
        const response = await userService.saveEditedUserGender(req)
        if (response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    } catch (err) { console.log(err); }
}

const editUserAddress = async (req, res) => {
    try {
        const response = await userService.saveEditedUserAddress(req)
        if (response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    } catch (err) { console.log(err); }
}



const editUserPassword = async (req, res) => {
    try {
        console.log(11111);
        const response = await userService.saveEditedUserPassword(req,res)
        if (response.status === 400) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
        if (response.status === 200) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/manageYourProfilePage?msg=${response.msg}`)

    } catch (err) { console.log(err); }
}

const forgotPassword = (req, res) => {
    res.redirect('/forgotEmailPage')
}

const forgotEmailPage = (req, res) => {
    const msg = req.query.msg
    res.render('forgotEmailPage', { msg })
}

const emailSubmit = async (req, res) => {
    if (!(req.session.otp)) {
        const response = await userService.generateOtpAndSendForForgot(req)
        if (response.status === 202) res.redirect(`/forgotEmailPage?msg=${response.msg}`)
        else res.redirect('/otpVerificationPage')
    }

}
const resendOtp = async (req, res) => {
    const response = await userService.generateOtpAndSendForForgot(req)
    if (response.status === 202) res.redirect('/otpVerificationPage')
}

const otpVerificationPage = (req, res) => {
    const msg = req.query.msg
    res.render('otpForgot', { msg })
}

const otpForgotSubmit = async (req, res) => {
    const response = await userService.authAndSavePassword(req)
    if (response.status === 200) res.redirect(`/newPassword?msg=${response.msg}`)
    if (response.status === 400) res.redirect(`/otpVerificationPage?msg=${response.msg}`)
}

const newPassword = (req, res) => {
    res.render('newPasswordPage')
}

const newPasswordSubmit = async (req, res) => {
    try {
        const response = await userService.changePassord(req)
        if (response.status === 200) res.redirect(`/login?msg=${response.msg}`)
        if (response.status === 400) res.redirect(`/newPassword?msg=${response.msg}`)
        if (response.status === 500) res.redirect(`/newPassword?msg=${response.msg}`)

    } catch (err) { console.log(err); }
}

const hotelDetails = (req, res) => {
    const id = req.params._id
    console.log(req.params._id, "22222222");
    req.session.hotelId = id
    console.log(req.session.hotelId + "<<<<444444>>>>");
    res.redirect('/hotelDetailsPage')
}

const hotelDetailsPage = async (req, res) => {
    try {

        const images = await userService.roomImages(req)
        const user = req.session.user
        const msg = req.query.msg
       

        let checkin_date = req.session.checkin_date
        let checkout_date = req.session.checkout_date

        if (!checkin_date) {
            const today = new Date().toISOString().split('T')[0];
            checkin_date = today
            req.session.checkin_date = checkin_date

            console.log(checkin_date,"checkin_date");

        }
        if (!checkout_date) {
            const today = new Date()
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const tomorrowString = tomorrow.toISOString().split('T')[0];
            checkout_date = tomorrowString
            req.session.checkout_date = checkout_date
            console.log(checkout_date,"checkout_date")
        }


        const roomArray = await userService.roomDetails(req)
        console.log(roomArray,"roomArray");
        let no_ofRooms =  req.session.noOfRooms
       let no_ofAdults = req.session.num_adults

        res.render('user/rooms', {no_ofAdults,no_ofRooms, roomArray, images, checkin_date, checkout_date, user, msg })

    } catch (err) { console.log(err); }
}
const sortHotels = async (req, res) => {
    try {
        const sortedHotels = await userService.sortHotels(req)
        const userName = ''
        res.render('user/hotels', { sortedHotels, userName })
        console.log(req.query);

    } catch (err) { console.log(err); }
}

const filterHotels = async (req, res) => {
    try {
        const { amenitie, star_rating } = req.body    
        const city = req.session.city
        const filteredHotels = await userService.filteredData(req.body,city)
        console.log(filteredHotels,"filteredHotels");
       if(filteredHotels.data) req.session.filtered = filteredHotels.data
       console.log(req.session.filtered,"req.session.filtered");
       res.redirect('/hotelsPage')
    } catch (err) { console.log(err); }
}














const proceedBooking = async (req, res) => {
    try {
        req.session.roomType = req.params.roomType
        const roomDetails = await userService.selectedRoom(req)
        const roomData = roomDetails.selectedRoom
        const hotelData = roomDetails.selectedHotel

        req.session.roomData = roomData
        req.session.hotelData = hotelData

        let checkin_date = req.session.checkin_date
        let checkout_date = req.session.checkout_date

        if (!checkin_date) {
            const today = new Date().toISOString().split('T')[0];
            checkin_date = today
            req.session.checkin_date = checkin_date

            console.log(checkin_date,"checkin_date");

        }
        if (!checkout_date) {
            const today = new Date()
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const tomorrowString = tomorrow.toISOString().split('T')[0];
            checkout_date = tomorrowString
            req.session.checkout_date = checkout_date
            console.log(checkout_date,"checkout_date")
        }

        res.redirect('/proceedBookingPage')

    } catch (err) { console.log(err); }
}


const proceedBookingPage = async (req, res) => {

    try {
        const user = req.session.user
        const userData = await userService.findUser(user)
        const roomData = req.session.roomData
        const hotelData = req.session.hotelData
        const checkin_date = req.session.checkin_date
        const checkout_date = req.session.checkout_date
        const noOfRooms = req.session.noOfRooms
        const noOfAdults = req.session.num_adults
     
        const dateObject1 = new Date(checkin_date);
        const dateObject2 = new Date(checkout_date);
        if (!isNaN(dateObject1) && !isNaN(dateObject2)) {
            var numberOfDays = Math.ceil((dateObject2 - dateObject1) / (1000 * 60 * 60 * 24));
            console.log(numberOfDays);
        } else {
            console.error('Invalid date format');
        }
        console.log(numberOfDays,"numberOfDays");
        const totalAmount =numberOfDays * noOfRooms * roomData.price
        req.session.totalAmount_first = totalAmount
       // const checkRoomAvailability = await userService.checkRoomAvailability(req,noOfRooms)
        const msg = req.query.msg
       // const availablityMsg = checkRoomAvailability.msg
       // console.log(availablityMsg, "availablityMsg");
        res.render('user/proceedBooking', {user,userData,numberOfDays, roomData, hotelData, checkin_date, checkout_date,totalAmount,noOfRooms, msg,noOfAdults })
    } catch (err) { console.log(err.message); }
}

const getRooms=(req,res)=>{
    try{
        console.log(req.body.num_rooms,"num_rooms");
        req.session.noOfRooms = req.body.num_rooms
        res.json({sucess:req.session.noOfRooms})
    }catch(err){console.log(err.message);}
}
const getAdults=(req,res)=>{
    try{
        console.log(req.body,"req.body")
        const {num_adults,numRooms,expectesRoomNumber} = req.body
        console.log(req.body.num_adults,"num_adults");
        req.session.num_adults = num_adults
        console.log(req.session.num_adults,"req.session.num_adults,")

        if(expectesRoomNumber >= numRooms) req.session.noOfRooms = expectesRoomNumber
        res.json({sucess:req.session.num_adults})
    }catch(err){console.log(err.message);}
}


const verifyRoomAvailability = async (req,res)=>{
    try{
        const response = await userService.checkRoomAvailability(req)
        if(response.msg === " ") res.json({success:"ok"})
        else res.json({success:"no"})
    }catch(err){console.log(err.message);}
}

const checkInDatecheckOutDate = (req, res) => {
    const { checkin_date, checkout_date } = req.body
    req.session.checkin_date = checkin_date
    req.session.checkout_date = checkout_date
    res.redirect('/hotelDetailsPage')

}
const confirmBooking = async (req, res) => {
    try {
        req.session.booking = req.body
        res.redirect('/confirmPayment')
    } catch (err) { console.log(err); }
}

const confirmPayment = async (req, res) => {
    try {
        const user  = req.session.user
        const booking = req.session.booking
        const roomData = req.session.roomData
        const coupons = await userService.findCoupons(req)
        const couponSelected = req.session.couponSelected
        const couponMsg = coupons.couponMsg
        const userName = ""
        const msg = req.query.msg
        const checkin_date = req.session.checkin_date
        const checkout_date = req.session.checkout_date

        const dateObject1 = new Date(checkin_date);


        const dateObject2 = new Date(checkout_date);


        if (!isNaN(dateObject1) && !isNaN(dateObject2)) {
            var numberOfDays = Math.ceil((dateObject2 - dateObject1) / (1000 * 60 * 60 * 24));
            console.log(numberOfDays);
        } else {
            console.error('Invalid date format');
        }
        req.session.numberOfDays = numberOfDays
        var noOfRooms = req.session.noOfRooms
        console.log(numberOfDays, "numberOfDays");
        const offer = await userService.findCategoryOffer(req)
        req.session.offer = offer
        const walletMoney = await userService.findWalletMoney(req)
        req.session.walletMoneyUsed = walletMoney.wallet
        console.log(walletMoney, "wallet");
        var totalAmount =  req.session.totalAmount_first

        console.log(totalAmount,"totalAmount-first");
        if (couponSelected && offer) {
            console.log(111);
            var amount = (totalAmount- ((roomData.price * (offer.discount / 100)) * noOfRooms )) - parseInt(couponSelected) - walletMoney.wallet
            totalAmount = amount + (amount * 0.12)
        } else if (offer && !couponSelected) {
            console.log(222);
            console.log(totalAmount,roomData.price ,offer.discount,noOfRooms,walletMoney.wallet,"datas");
            amount = (totalAmount - ((roomData.price * (offer.discount / 100)) * noOfRooms )) - walletMoney.wallet
            totalAmount = amount + (amount * 0.12)

        } else if (couponSelected && !offer) {
            console.log(333);

            amount = (totalAmount - parseInt(couponSelected))- walletMoney.wallet
            totalAmount = amount + (amount * 0.12)

        } else {
            console.log(444);

            amount = (totalAmount -walletMoney.wallet)
            totalAmount = amount + (amount * 0.12)

        }

        console.log(totalAmount,"totalAmount-last");

        req.session.totalAmount = totalAmount
        res.render('user/payment', { user,userName, msg, checkin_date, checkout_date, booking, roomData, coupons, couponMsg, totalAmount, offer, couponSelected, walletMoney, amount, numberOfDays ,noOfRooms})
    } catch (err) { console.log(err); }
}

const selectedCoupon = (req, res) => {
    try {
        req.session.couponSelected = req.params.coupon
        res.redirect('/confirmPayment')
    } catch (err) { console.log(); }
}

const removeCoupon = (req, res) => {
    try {
        delete req.session.couponSelected
        res.redirect('/confirmPayment')

    } catch (err) { console.log(err); }
}
const bookNow = async (req, res) => {
    try {
        console.log(req.query.param, "*******");
        var saveAndConfirm = await userService.saveBooking(req)
        if (saveAndConfirm.status === 200) res.redirect('/bookingConfirmed')
        if (saveAndConfirm.status === 202) res.redirect(`/confirmPayment?msg=${saveAndConfirm.msg}`)

    } catch (err) { console.log(err); }
}

const bookingConfirmed = (req,res)=>{
    try{
      res.redirect('/bookingConfirmedPage')
    }catch(err){console.log(err.message);}
}
const bookingConfirmedPage = async (req,res)=>{
    try{
        const user = req.session.user
        const booking = req.session.bookingData
        console.log(booking,"booking");
        booking.checkin_date =  booking.checkin_date.split('T')[0]
        booking.checkout_date =  booking.checkout_date.split('T')[0]

        console.log(booking,"booking");
        const hotel = await userService.findHotel(booking.hotel_id)
        const room = await userService.findRoom(booking.room_id)
console.log(hotel,room,"hotel,room")
        res.render('user/bookingFinalPage',{user,booking,hotel,room})
    }catch(err){console.log(err.message);}
}

const manageBookings = (req, res) => {
    try {
        if (req.session.user) {
            res.redirect('/manageBookingsPage')
        } else {
            const msg = "Create a account "

            res.redirect(`/login?msg=${msg}`)
        }
    } catch (err) { console.log(err); }
}

const manageBookingsPage = async (req, res) => {
    try {
        const email = req.session.user
        const hotels = await userService.findBookings(email)
        console.log(hotels);
        const msg = req.query.msg
        const user = req.session.user
        res.render('user/manageBookings', { hotels, msg,user })
    } catch (err) { console.log(err); }
}

const cancelBooking = async (req, res) => {
    try {
        const response = await userService.cancelBooking(req)
        if (response.status === 200) res.redirect(`/manageBookingsPage?msg=${response.msg}`)
    } catch (err) { console.log(err); }
}
const wallet = async (req, res) => {
    try {
        res.redirect('/walletPage')
    } catch (err) { console.log(err); }
}
const walletPage = async (req, res) => {
    try {
        const user = req.session.user
        const wallet = await userService.findWalletMoney(req)
        const transactions = await userService.findWalletTransactions(req)
        console.log(transactions,"transactions");
        const msg = transactions.msg
        res.render('user/wallet', { user,wallet,transactions,msg })
    } catch (err) { console.log(err.message); }
}


const updateBooking = async () => {
    try {
        const response = await userService.updateFinishedBooking()
        console.log(111222333);
    } catch (err) { console.log(err); }
}

const generateInvoice = async (req, res) => {
    try {
        req.session.invoice = req.params.id
        const response = await userService.genInvoice(req)

        console.log(response, "response")
        if (response.status === 201) res.redirect(`/manageBookingsPage?msg=${response.msg}`)
        else {
            console.log(7777);
            console.log(response.data[0].checkout,"response.data.checkout_date");

            const currentDate = new Date().toISOString().split('T')[0];
            response.data[0].date = currentDate
            response.data[0].checkout = response.data[0].checkout.toISOString().split('T')[0];

            
            console.log(response.data[0].checkout,"response.data.checkout_date");
            await invoice(response.data, response.invoiceNumber, res)
        }
    } catch (err) { console.log(err); }
}



module.exports = {
    userHome,
    userhotelsList,
    userhotelsListPage,
    userLogin,
    userRegister,
    userRegisterView,
    userRegisterPage,
    otpVerification,
    otpPage,
    otpAuthentication,
    userLoginHome,
    signOut,
    userLoginHomeView,
    userManagement,
    userManagementPage,
    manageYourProfile,
    manageYourProfilePage,
    editUserName,
    //editUserEmail,
    editUserMobile,
    editUserGender,
    editUserAddress,
    editUserPassword,
    forgotPassword,
    forgotEmailPage,
    emailSubmit,
    generateOTP,
    verifyOTP,
    saveEmail,
    resendOtp,
    otpVerificationPage,
    otpForgotSubmit,
    newPassword,
    newPasswordSubmit,
    hotelDetails,
    hotelDetailsPage,
    sortHotels,
    filterHotels,
    getRooms,
    proceedBooking,
    proceedBookingPage,
    checkInDatecheckOutDate,
    confirmBooking,
    confirmPayment,
    bookNow,
    manageBookings,
    manageBookingsPage,
    selectedCoupon,
    removeCoupon,
    cancelBooking,
    wallet,
    walletPage,
    updateBooking,
    generateInvoice,
    getAdults,
    verifyRoomAvailability,
    bookingConfirmed,
    bookingConfirmedPage
    // salesReport,
    // salesReportSelected,
}