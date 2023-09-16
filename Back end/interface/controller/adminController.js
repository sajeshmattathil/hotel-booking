const adminService = require('../../service/adminService')

const adminLogin = (req, res) => {
  res.render('admin-login')
}

const adminAuthentication = async (req, res) => {

  const response = await adminService.auth(req)
  if (response.status === 403) res.redirect('/admin')
  if (response.status === 200) res.redirect('/admin/home'); console.log(req.session.admin);
  if (response.status === 400) res.redirect('/admin')

}
const adminHome = async (req, res) => {

  const email = req.session.admin
  const name = await adminService.adminUsername(email)
  res.render('adminHome', { username: name })

}

const categoryManagement = (req, res) => {
  res.redirect('/admin/categoryManagementPage')
}
const categoryManagementPage = (req, res) => {
  const msg1 = req.query.msg1
  const msg2 = req.query.msg2
  res.render('admin-forms', { msg1, msg2 })
}
const saveCategory = async (req, res) => {
  try{
  const response = await adminService.saveNewCategory(req)
  console.log(response);
  if(response.status === 200)  res.redirect(`/admin/categoryManagementPage?msg1=${response.message}`)
  if(response.status === 400)  res.redirect(`/admin/categoryManagementPage?msg1=${response.message}`)


  }catch(error){console.log(error);}

}

const saveSubCategory=async (req, res) => {
  try{
  const response = await adminService.saveNewSubCategory(req)
  console.log(response);
  if(response.status === 200)  res.redirect(`/admin/categoryManagementPage?msg2=${response.message}`)
  if(response.status === 400)  res.redirect(`/admin/categoryManagementPage?msg2=${response.message}`)


  }catch(error){console.log(error);}

}



const hotelRequests = (req, res) => {
  res.redirect('/admin/aproveHotelList')

}

const hotelRequestView = async (req, res) => {
  try {
    const items = await adminService.findRequests(req)
    console.log(items);
    const msg = req.query.msg
    res.render('admin-requests', { items: items, msg: msg })
  } catch (error) { console.log(error); }
}

const requestApprove = async (req, res) => {
  try {
    const response = await adminService.approve(req)
    if (response.status === 200) res.redirect(`/admin/aproveHotelList?msg=${response.msg}`)
    if (response.status === 400) res.redirect(`/admin/aproveHotelList?msg=${response.msg}`)

  } catch (error) { console.log(error); }

}

module.exports = {
  adminLogin,
  adminAuthentication,
  adminHome,
  categoryManagement,
  categoryManagementPage,
  saveCategory,
  saveSubCategory,
  hotelRequests,
  hotelRequestView,
  requestApprove
}