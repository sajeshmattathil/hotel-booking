const express = require('express')
const router = express.Router()
const admincontroller = require('../controller/adminController')
const auth = require('../../middleware/authMiddleware')
const jwt=require('../../middleware/jwt')

router.get('/', admincontroller.adminLogin)
router.post('/adminlogin',jwt.generateToken, admincontroller.adminAuthentication)
router.get('/home', admincontroller.adminHome)
router.get('/category-management',jwt.verifyToken, admincontroller.categoryManagement)
router.get('/categoryManagementPage', auth.adminAuthCheck, admincontroller.categoryManagementPage)
router.post('/add-category', auth.adminAuthCheck, admincontroller.saveCategory)
router.post('/add-subcategory', auth.adminAuthCheck, admincontroller.saveSubCategory)
router.get('/approval-requests', auth.adminAuthCheck, admincontroller.hotelRequests)
router.get('/aproveHotelList', auth.adminAuthCheck, admincontroller.hotelRequestView)
router.get('/approve/:email', auth.adminAuthCheck, admincontroller.requestApprove)

module.exports = router







