const express=require('express')
const router=express.Router()
const controller=require('../controller/userController')
const paymentController = require('../../utils/payment')


router.get('/',controller.userHome)
router.post('/searchHotels',controller.userhotelsList)
router.get('/hotelsPage',controller.userhotelsListPage)
router.get('/login',controller.userLogin)
router.post('/login-submit',controller.userLoginHome)
router.get('/login/home',controller.userLoginHomeView)
router.get('/signupPage',controller.userRegisterView)
router.get('/signUp',controller.userRegisterPage)
router.post('/signup-submit',controller.otpVerification)
router.get('/otpPage',controller.otpPage)
router.post('/otp-submit',controller.otpAuthentication)
router.get('/register',controller.userRegister)
router.get('/sign_out',controller.signOut)
router.get('/userManagement',controller.userManagement)
router.get('/userManagementPage',controller.userManagementPage)
router.get('/manageYourProfile',controller.manageYourProfile)
router.get('/manageYourProfilePage',controller.manageYourProfilePage)
router.post('/edit-userName',controller.editUserName)
//router.post('/edit-userEmail',controller.editUserEmail)
router.post('/edit-userMobile',controller.editUserMobile)
router.post('/edit-userGender',controller.editUserGender)
router.post('/edit-userAddress',controller.editUserAddress)
router.post('/edit-userPassword',controller.editUserPassword)
router.get('/forgotPassword',controller.forgotPassword)
router.get('/forgotEmailPage',controller.forgotEmailPage)
//router.post('/email-submit',controller.emailSubmit)
router.post('/generateOTP',controller.generateOTP)
router.post('/verifyOTP',controller.verifyOTP)
router.post('/saveEmail',controller.saveEmail)

router.get('/resendOtp',controller.resendOtp)
router.get('/otpVerificationPage',controller.otpVerificationPage)
router.post('/otpForgot-submit',controller.otpForgotSubmit)
router.get('/newPassword',controller.newPassword)
router.post('/newPassword-submit',controller.newPasswordSubmit)
router.get('/hotelDetails/:_id',controller.hotelDetails)
router.get('/hotelDetailsPage',controller.hotelDetailsPage)
router.get('/sortHotels',controller.sortHotels)
//router.post('/filter-hotels',controller.filterHotels)
router.post('/filter_hotels',controller.filterHotels)
router.get('/proceedBooking/:roomType',controller.proceedBooking)
router.get('/proceedBookingPage',controller.proceedBookingPage)
router.post('/checkInDate-checkOutDate',controller.checkInDatecheckOutDate)
router.post('/confirmBooking',controller.confirmBooking)
router.get('/confirmPayment',controller.confirmPayment)
router.get('/bookNow',controller.bookNow)
router.post('/createOrder', paymentController.createOrder);
router.get('/manageBookings',controller.manageBookings)
router.get('/manageBookingsPage',controller.manageBookingsPage)
router.get('/selected_coupon/:coupon',controller.selectedCoupon)
router.get('/remove_coupon',controller.removeCoupon)
router.get('/cancel_booking/:id',controller.cancelBooking)
router.get('/wallet',controller.wallet)
router.get('/walletPage',controller.walletPage)
router.get('/generate_invoice/:id',controller.generateInvoice)
router.post('/sales_report',controller.salesReport)
router.post('/sales_report_selected',controller.salesReportSelected)


module.exports=router


