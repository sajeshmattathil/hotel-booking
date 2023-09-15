const ownerService = require('../../service/ownerService')


const ownerlogin = (req, res) => {
    const msg = req.query.msg
    res.render('owner-login', { msg: msg })
}
const ownerAuthCheck = async (req, res) => {
    let response = await ownerService.auth(req)
    if (response.status === 403) res.redirect(`/owner?msg=${response.msg}`)
    if (response.status === 200) res.redirect('/owner/home')
    if (response.status === 400) res.redirect(`/owner?msg=${response.msg}`)

}

const ownerHome = async (req, res) => {
    const email = req.session.owner
    const name = await ownerService.ownerUsername(email)
    res.render('ownerHome', { username: name })
}

const hotelsManagement = async (req, res) => {
    const response = await ownerService.hotelsWithIncompleteDetails()
    console.log(response);
    if (response instanceof Array) {
        res.redirect('/owner/hotelsManagementPage')
    }
    else {
        if (response.status === 400) res.redirect(`/owner/hotelsManagementPage?msg=${response.message}`)
    }

}
const hotelsManagementPage = async (req, res) => {
    console.log(56446546);
    try {

        const hotels = await ownerService.hotelsWithIncompleteDetails()
        console.log(hotels)
        const msg = req.query.msg
        res.render('owner-hotelManagement', { hotels, msg })
    } catch (err) { console.log(err); }
}

const addRoomDetails= async (req,res)=>{
  try{
   res.redirect('/owner/roomForm')
  }catch(error){console.log(error);}
}


const roomForm= (req,res)=>{
res.render('ownerRoomForm')
}

const addNewHotel = async (req, res) => {
    console.log(req.body);
    const response = await ownerService.authHotel(req)
    if (response.status === 200) res.redirect(`/owner/forms?msg=${response.msg}`);
    if (response.status === 400) res.redirect(`/owner/forms?msg=${response.msg}`);


}

const ownerForms = (req, res) => {
    let msg = req.query.msg
    console.log(msg);
    res.render('ownerForms', { msg: msg })
}

module.exports = {
    ownerlogin,
    ownerAuthCheck,
    ownerHome,
    hotelsManagement,
    hotelsManagementPage,
    addRoomDetails,
    roomForm,
    addNewHotel,
    ownerForms
}