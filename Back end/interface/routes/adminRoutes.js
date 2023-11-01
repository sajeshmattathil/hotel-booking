const express = require('express')
const router = express.Router()
const admincontroller = require('../controller/adminController')
const jwt = require('../../middleware/jwt')

router.get('/', admincontroller.adminLogin)
router.post('/adminlogin', jwt.generateToken, admincontroller.adminAuthentication)
router.get('/home', admincontroller.adminHome)
router.get('/category-management',jwt.verifyToken,admincontroller.categoryManagement)
router.get('/categoryManagementPage',jwt.verifyToken,admincontroller.categoryManagementPage)
router.post('/add-category',jwt.verifyToken,admincontroller.saveCategory)
router.post('/add-subcategory',jwt.verifyToken,admincontroller.saveSubCategory)
router.get('/approval-requests',jwt.verifyToken,admincontroller.hotelRequests)
router.get('/aproveHotelList',jwt.verifyToken,admincontroller.hotelRequestView)
router.get('/approve/:email',jwt.verifyToken,admincontroller.requestApprove)
router.get('/owner-management',jwt.verifyToken,admincontroller.ownerManagement)
router.get('/ownerMangementPage',jwt.verifyToken,admincontroller.ownerMangementPage)
router.post('/add-newOwner',jwt.verifyToken,admincontroller.addNewOwner)
router.get('/coupon-management',jwt.verifyToken,admincontroller.couponManagement)
router.get('/couponManagementPage',jwt.verifyToken,admincontroller.couponManagementPage)
router.post('/add_coupon',jwt.verifyToken,admincontroller.addCoupon)
router.get('/sign_out',jwt.verifyToken,admincontroller.signOut)
router.post('/sales_report',jwt.verifyToken,admincontroller.salesReport)
router.post('/sales_report_selected',jwt.verifyToken,admincontroller.salesReportSelected)
router.post('/show_graph',jwt.verifyToken,admincontroller.salesRevenueInGraph)

module.exports = router







