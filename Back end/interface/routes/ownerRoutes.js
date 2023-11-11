const express = require('express')
const router = express.Router()
const ownerController = require('../controller/ownerController')
const auth = require('../../middleware/authMiddleware')
const upload = require('../../middleware/uploadImages')

router.get('/', ownerController.ownerlogin)
router.post('/ownerlogin', ownerController.ownerAuthCheck)
router.get('/home', ownerController.ownerHome)
router.get('/hotelsManagement', auth.ownerAuthCheck, ownerController.hotelsManagement)
router.get('/hotelsManagementPage', auth.ownerAuthCheck, ownerController.hotelsManagementPage)
router.post('/add-hotel', auth.ownerAuthCheck, upload.array('images', 3), ownerController.addNewHotel)
router.get('/addRoomDetails/:_id', auth.ownerAuthCheck, ownerController.addRoomDetails)
router.get('/roomForm', auth.ownerAuthCheck, ownerController.roomForm)
router.post('/roomForm-submit', auth.ownerAuthCheck,upload.array('images', 3), ownerController.roomAuthentication)
router.get('/forms', auth.ownerAuthCheck, ownerController.ownerForms)
router.get('/offer_management/:id',auth.ownerAuthCheck,ownerController.offerManagement)
router.get('/offerManagementPage',auth.ownerAuthCheck,ownerController.offerManagementPage)
router.post('/add_category_offer',ownerController.addCategoryOffer)
router.get('/signout',ownerController.signOut)
module.exports = router




