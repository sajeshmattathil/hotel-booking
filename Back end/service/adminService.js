const bcrypt = require('bcryptjs')
const adminRepository = require('../repository/adminRepository')
const Category = require('../domain/model/category')
const subCategory = require('../domain/model/subCategory')
const owner = require('../domain/model/owner')
const coupon = require('../domain/model/coupon')
const { userRegister } = require('../interface/controller/userController')

const auth = async (req) => {
     const { email, password } = req.body
     if (!email && !password) {
          const msg = "Fill empty fields "
          return { status: 401, msg }
     }
     try {
          const admin = await adminRepository.findAdminByEmail(email)
          if (!admin) {
               const msg = "Username or password is incorrect "; return { status: 401, msg }
          }
          const checkedPassword = await bcrypt.compare(password, admin.password)
          if (admin && checkedPassword) {
               if (admin.isAdmin) {
                    req.session.admin = email;
                    return { status: 200 }
               }
          }
          else {
               const msg = "Username or password is incorrect "
               return { status: 401, msg }
          }
     }
     catch (error) {
          console.log(error);
     }
}

const adminUsername = async (email) => {
     try {
          const adminData = await adminRepository.findAdminNameByEmail(email)
          if (adminData) {
               const name = adminData.name
               return name
          } else return null

     } catch (err) { console.log(err); }
}

const findAdmin = async (email)=>{
     try{
      const adminData = await adminRepository.findAdminByEmail(email)
          if(adminData) return adminData
     }catch(err){console.log(err.message);}
}
const saveNewCategory = async (req) => {
     try {

          const name = req.body.category
          if (!name) {
               const msg = "Something went wrong"
               return { status: 400, message: msg }
          }

          const checkExistingCategory = await adminRepository.findCategoryByName(name)
          if (!checkExistingCategory) {

               const newCategory = new Category({
                    name: name
               })

               newCategory.save()
               const msg = "Category added sucessfully"
               return { status: 200, message: msg }
          }
     } catch (error) {
          console.log(error.message)
          const msg = "Something went wrong"
          return { status: 400, message: msg }
               ;
     }
}

const saveNewSubCategory = async (req) => {
     try {
          const name = req.body.subcategory
          if (!name) {
               const msg = "Something went wrong"
               return { status: 400, message: msg }
          }
          const checkExistingSubCategory = await adminRepository.findSubCategoryByName(name)
          if (!checkExistingSubCategory) {

               const newSubCategory = new subCategory({
                    name: name
               })
               newSubCategory.save()
               const msg = "Sub-Category added sucessfully"
               return { status: 200, message: msg }
          }
     } catch (error) {
          console.log(error.message)
          const msg = "Something went wrong"
          return { status: 400, message: msg }
               ;
     }
}

const findRequests = async () => {
     try {
          const requestDatas = await adminRepository.findHotelApprovalRequests()
          console.log(requestDatas);
          if (requestDatas) return requestDatas
          else console.log('requestDatas not found');

     } catch (error) { console.log(error); }
}

const approve = async (req) => {
     try {
          const email = req.params.email
          const requestDatas = await adminRepository.findHotelAndApprove(email)
          if (requestDatas) {
               const msg = "Request approved"
               return { status: 200, msg: msg }
          }
          else {
               const msg = 'Something went wrong'
               return { status: 400, msg: msg }
          }
     } catch (error) { console.log(error); }
}

const rejectApprovalRequest = async (req)=>{
     try {
          const email = req.params.email
          const requestDatas = await adminRepository.findHotelAndReject(email)
          if (requestDatas) {
               const msg = "Request rejected"
               return { status: 200, msg: msg }
          }
          else {
               const msg = 'Something went wrong'
               return { status: 400, msg: msg }
          }
     } catch (error) { console.log(error); }
}

const findHotelWithIncomplete = async (email)=>{
     try{
        const data = await adminRepository.findHotelWithIncomplete(email)
        if(data) return data
     }catch(err){console.log(err.message);}
}
const authenticateOwner = async (req) => {

     try {
          const { first_name, last_name, email, mobile, password, confirm } = req.body;
          console.log(req.body);
          if (!first_name || !last_name || !email || !mobile || !password || !confirm) {
               console.log('Fill in empty fields');
               const msg = 'Fill in empty fields'
               return { status: 400, message: msg };
          }

          // Confirm password
          if (password !== confirm) {
               console.log('Passwords must match');
               const msg = 'Passwords must match'
               return { status: 400, message: msg };
          }
          const existingOwner = await adminRepository.findOwnerByEmail(email)
          console.log(existingOwner);
          if (existingOwner) {
               const msg = 'Owner already exists'
               return { status: 200, message: msg }
          }
          const hashPassword = await bcrypt.hash(password, 10)

          const newOwner = new owner({
               owner_name: first_name,
               last_name,
               email,
               mobile,

               password: hashPassword
          })
          newOwner.save()
          const msg = 'Owner saved sucessfully'
          return { status: 200, message: msg }
     } catch (error) { console.log(error); }
}

const existingCoupons = async () => {
     try {
          const data = await adminRepository.findExistingCoupons()
          return data
     } catch (err) { console.log(err); }
}

const addCoupon = async (req) => {
     try {
          const { name, discount, startingDate, expiry } = req.body
          const newCoupon = new coupon({
               name,
               discount,
               startingDate,
               expiry
          })
          newCoupon.save()
          const msg = "Coupon saved sucessfully"
          return { status: 200, msg }
     } catch (err) { console.log(err); }
}

const findAlldetails = async (req, res) => {
     try {
          const data = await adminRepository.findsales()
          if (data.length) return data

     } catch (err) { console.log(err.message); }
}

const findAllUsers = async () => {
     try {
          const data = await adminRepository.findAllUsers()
          if (data) return data
     } catch (err) { console.log(err.message); }
}
const findSalesReport = async (data) => {
     try {
          const startDate = new Date(data.checkin_date);
          const endDate = new Date(data.checkout_date);

          const salesData = await adminRepository.findSalesData(startDate, endDate)
          if (salesData) return salesData
          else {
               const msg = "No data found"
               return { msg }
          }
     } catch (err) { console.log(err); }
}

const findSalesReportSelected = async (startDate, endDate) => {
     try {
          // const startDate = new Date(data.checkin_date); 
          // const endDate = new Date(data.checkout_date);

          const salesData = await adminRepository.findSalesData(startDate, endDate)
          if (salesData) return salesData
          else {
               const msg = "No data found"
               return { msg }
          }
     } catch (err) { console.log(err.message); }
}

const findAllOwners = async (req,res)=>{
     try{
       const data = await adminRepository.findAllOwners()
       if(data.length) return data
     }catch(err){console.log(err.message);}
}

const updateOwnerStatus = async (status,id)=>{
     try{

          await adminRepository.updateOwnerStatus(status,id)

     }catch(err){console.log(err.message);}
}

module.exports = {
     auth,
     findAdmin,
     adminUsername,
     saveNewCategory,
     saveNewSubCategory,
     findRequests,
     approve,
     rejectApprovalRequest,
     findHotelWithIncomplete,
     authenticateOwner,
     existingCoupons,
     addCoupon,
     findAlldetails,
     findAllUsers,
     findSalesReport,
     findSalesReportSelected,
     findAllOwners,
     updateOwnerStatus
}

