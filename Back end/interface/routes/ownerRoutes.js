const express = require('express')
const router = express.Router()
const ownerController = require('../controller/ownerController')
const auth = require('../../middleware/authMiddleware')
const upload = require('../../middleware/uploadImages')

router.get('/', ownerController.ownerlogin)
router.post('/ownerlogin', ownerController.ownerAuthCheck)
router.get('/home',ownerController.ownerHomePage)
router.get('/home_page', ownerController.ownerHome)

router.get('/hotelsManagement', auth.ownerAuthCheck, ownerController.hotelsManagement)
router.get('/hotelsManagementPage', auth.ownerAuthCheck, ownerController.hotelsManagementPage)
router.post('/add-hotel', auth.ownerAuthCheck,upload.array('images', 3), ownerController.addNewHotel)
router.get('/edit_hotels', auth.ownerAuthCheck, ownerController.editHotels)
router.get('/editHotelsPage', auth.ownerAuthCheck, ownerController.editHotelsPage)
router.get('/view_hotel_details/:id', auth.ownerAuthCheck, ownerController.viewHotelDetails)
router.get('/viewHotelDetailsPage', auth.ownerAuthCheck, ownerController.viewHotelDetailsPage)
router.post('/update_hotel', auth.ownerAuthCheck, ownerController.updateHotel)

router.get('/addRoomDetails/:_id', auth.ownerAuthCheck, ownerController.addRoomDetails)
router.get('/roomForm', auth.ownerAuthCheck, ownerController.roomForm)
router.post('/roomForm-submit',auth.ownerAuthCheck,  upload.array('images', 3), ownerController.roomAuthentication)

router.get('/forms', auth.ownerAuthCheck, ownerController.ownerForms)
router.get('/offer_management/:id',auth.ownerAuthCheck,ownerController.offerManagement)
router.get('/offerManagementPage',auth.ownerAuthCheck,ownerController.offerManagementPage)
router.post('/add_category_offer',ownerController.addCategoryOffer)
router.get('/signout',ownerController.signOut)
router.post('/change_offer_status',ownerController.changeOfferStatus)
module.exports = router




