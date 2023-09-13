const ownerService = require('../../service/ownerService')


const ownerlogin = (req, res) => {
    res.render('owner-login')
}
const ownerAuthCheck = async (req, res) => {
    const email = req.body.email
    let response = await ownerService.auth(req)

    if (response.status === 403) res.redirect('/owner')
    if (response.status === 200) res.redirect('/owner/home')
    if (response.status === 400) res.redirect('/owner')

}

const ownerHome = async (req, res) => {
    const email = req.session.owner
    const name = await ownerService.ownerUsername(email)
    res.render('ownerHome', { username: name })
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
    addNewHotel,
    ownerForms
}