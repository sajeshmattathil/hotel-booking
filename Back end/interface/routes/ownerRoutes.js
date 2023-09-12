const express=require('express')
const router=express.Router()
const ownerController=require('../controller/ownerController')
const auth=require('../../middleware/authMiddleware')

router.get('/',ownerController.ownerlogin)
router.post('/ownerlogin',ownerController.ownerAuthCheck)
router.get('/home',ownerController.ownerHome)
router.post('/add-hotel',ownerController.addNewHotel)
router.post('/upload',ownerController.uploadImages)
// Sidebar options
router.get('/forms',ownerController.ownerForms)



module.exports=router