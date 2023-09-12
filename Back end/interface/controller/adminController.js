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

const hotelRequests = (req, res) => {
  res.redirect('/admin/aproveHotelList')

}

const hotelRequestView = async (req, res) => {

  const items = await adminService.findRequests(req)
  res.render('admin-requests', { items: items })
}

const requestApprove = async (req, res) => {
  const response = await adminService.approve(req)
  if (response === 200) res.redirect('/admin/aproveHotelList')

}

module.exports = {
  adminLogin,
  adminAuthentication,
  adminHome,
  hotelRequests,
  hotelRequestView,
  requestApprove
}