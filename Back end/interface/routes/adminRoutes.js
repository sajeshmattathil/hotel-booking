const express=require('express')
const router=express.Router()
const admincontroller=require('../controller/adminController')
const auth=require('../../middleware/authMiddleware')



router.get('/',admincontroller.adminLogin)
 router.post('/adminlogin',admincontroller.adminAuthentication)
 router.get('/home',admincontroller.adminHome)

router.get('/approval-requests',auth.adminAuthCheck,admincontroller.hotelRequests)
router.get('/aproveHotelList',admincontroller.hotelRequestView)

router.get('/approve/:email',auth.adminAuthCheck,admincontroller.requestApprove)




module.exports=router







