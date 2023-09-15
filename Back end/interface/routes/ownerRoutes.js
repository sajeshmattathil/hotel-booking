const express = require('express')
const router = express.Router()
const ownerController = require('../controller/ownerController')
const auth = require('../../middleware/authMiddleware')
const upload = require('../../middleware/uploadImages')

router.get('/', ownerController.ownerlogin)
router.post('/ownerlogin', ownerController.ownerAuthCheck)
router.get('/home', ownerController.ownerHome)
router.get('/hotelsManagement',ownerController.hotelsManagement)
router.get('/hotelsManagementPage',ownerController.hotelsManagementPage)
router.get('/addRoomDetails:_id',ownerController.addRoomDetails)
router.get('/roomForm',auth.ownerAuthCheck,ownerController.roomForm)
router.post('/add-hotel', upload.array('images', 5), ownerController.addNewHotel)
// Sidebar options
router.get('/forms', ownerController.ownerForms)



module.exports = router