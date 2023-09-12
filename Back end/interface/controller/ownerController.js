const ownerService=require('../../service/ownerService')


const ownerlogin=(req,res)=>{
    res.render('owner-login')
}
const ownerAuthCheck=async (req,res)=>{
const email=req.body.email
let response=await ownerService.auth(req)

if(response.status===403) res.redirect('/owner')  
if(response.status===200) res.redirect('/owner/home')
if(response.status===400) res.redirect('/owner') 

}

const ownerHome=async (req,res)=>{
    const email=req.session.owner
    const name=await ownerService.ownerUsername(email)
    res.render('ownerHome',{username:name})
}

const addNewHotel=async (req,res)=>{
    const response= await ownerService.authHotel(req)
    console.log(response);
    if(response.status===200) res.redirect('/owner/forms');
    if(response.status===400) res.redirect('/owner/forms');


}

const uploadImages=async (req,res,next)=>{
    let response=await ownerService.uploadImagesService(req,res)
}

const ownerForms=(req,res)=>{
    res.render('ownerForms')
}

module.exports={
    ownerlogin,
    ownerAuthCheck,
    ownerHome,
    addNewHotel,
    uploadImages,
    ownerForms
}