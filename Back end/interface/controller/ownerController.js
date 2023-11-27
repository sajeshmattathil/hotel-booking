const ownerService = require('../../service/ownerService')
const upload = require('../../middleware/uploadImages')


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
const ownerHomePage =(req,res)=>{
    try{
   res.redirect('/owner/home_page')
    }catch(err){console.log(err.message);}
}


const ownerHome = async (req, res) => {
    const email = req.session.owner
    const name = await ownerService.ownerUsername(email)
    const owner = await ownerService.findOwner(email)

    // const totalSales = await ownerService.findTotalSales(email) 
    // console.log(totalSales,"revenue")
    const totalHotels = await ownerService.findTotalHotels(email)


    res.render('ownerHome', { username: name,totalHotels,owner })
}

const hotelsManagement = async (req, res) => {
    const response = await ownerService.hotelsWithIncompleteDetails()
    console.log(response);
    if (response instanceof Array) {
        res.redirect('/owner/hotelsManagementPage')
    }
    else {
        res.redirect('/owner/hotelsManagementPage')

       // if (response.status === 400) res.redirect(`/owner/hotelsManagementPage?msg=${response.message}`)
    }

}
const hotelsManagementPage = async (req, res) => {
    console.log(56446546);
    try {
        const email = req.session.owner
        const hotels = await ownerService.hotelsWithIncompleteDetails(email)
        console.log(hotels)
        const msg = req.query.msg
        res.render('owner-hotelManagement', { hotels, msg })
    } catch (err) { console.log(err); }
}

const addRoomDetails = async (req, res) => {
    try {
        req.session.hotel_id = req.params._id
        res.redirect('/owner/roomForm')
    } catch (error) { console.log(error.message); }
}

const roomForm = async (req, res) => {
    try {
        const category = await ownerService.findCategories()
        const subcategory = await ownerService.findSubCategories()
        const msg = req.query.msg
        res.render('ownerRoomForm', { msg, category, subcategory })
    } catch (error) { console.log(error); }
}

const roomAuthentication = async (req, res) => {
  console.log(req.body,"sddsdsfd")
    const response = await ownerService.authenticateRoomDetails(req)
    if (response.status === 200) res.json({message:response.message})
   // if (response.status === 400) res.redirect(`/owner/roomForm?msg=${response.message}`);

}

const addNewHotel = async (req, res) => {
    console.log(req.body);
    const response = await ownerService.authHotel(req)
    if (response.status === 200) res.redirect(`/owner/forms?msg=${response.msg}`);
    if (response.status === 400) res.redirect(`/owner/forms?msg=${response.msg}`);
}

const ownerForms = (req, res) => {
    let msg = req.query.msg
    res.render('ownerForms', { msg })
}

const offerManagement = (req,res)=>{
    try{
        req.session.hotel_id=req.params.id
        console.log(req.session.hotel_id);
      res.redirect('/owner/offerManagementPage')
    }catch(err){console.log(err);}
}

const offerManagementPage = async (req,res)=>{
    try{
        console.log(req.session.hotel_id);
        let modifiedOffers
        const category= await ownerService.findCategories() 
       const offers = await ownerService.findOffers(req)  
       console.log(offers);
       if(!offers.msg){
         modifiedOffers = offers.map(offer => {
            return {
              ...offer,
              startingDate: offer.startingDate.toISOString().split('T')[0],
              expiry:offer.expiry.toISOString().split('T')[0],
              discount:offer.discount,
              name:offer.name,
              roomType:offer.roomType,
              isActive: offer.isActive
            };
          });
       }
       
        console.log(offers,'777777');  
        const no_data = offers.msg
        const msg = req.query.msg
        res.render('ownerOfferManagement',{offers:modifiedOffers,msg,category,no_data})
        req.query.msg = ''
      }catch(err){console.log(err);}
}

const addCategoryOffer = async (req,res)=>{
    try{
        const response = await ownerService.addCategoryOffer(req)
        if (response.status === 200) res.redirect(`/owner/offerManagementPage?msg=${response.msg}`);
        if (response.status === 201) res.redirect(`/owner/offerManagementPage?msg=${response.msg}`);

    }catch(err){console.log(err);}
}

  const signOut = (req,res)=>{
    try{
        res.redirect('/owner')
        delete req.session.owner
    }catch(err){console.log(err.message);}
  }  

  const changeOfferStatus = async (req,res)=>{
    try{
        console.log(req.body,"req.body")
        const id = req.body.offerId
        const status = req.body.status
       await ownerService.updateOfferStatus(status,id)
       res.json({})
    }catch(err){console.log(err.message);}
  }
module.exports = {
    ownerlogin,
    ownerAuthCheck,
    ownerHomePage,
    ownerHome,
    hotelsManagement,
    hotelsManagementPage,
    roomAuthentication,
    addRoomDetails,
    roomForm,
    addNewHotel,
    ownerForms,
    offerManagement,
    offerManagementPage,
    addCategoryOffer,
    changeOfferStatus,
    signOut,
}