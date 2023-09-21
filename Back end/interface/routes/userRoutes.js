const express=require('express')
const router=express.Router()
const controller=require('../controller/userController')

router.get('/',controller.userHome)
router.post('/hotels',controller.userhotelsList)
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

router.get('/userManagement',controller.userManagement)
router.get('/userManagementPage',controller.userManagementPage)
router.get('/manageYourProfile',controller.manageYourProfile)
router.get('/manageYourProfilePage',controller.manageYourProfilePage)

module.exports=router