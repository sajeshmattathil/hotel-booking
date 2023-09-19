const bcrypt = require('bcryptjs')
const adminRepository = require('../repository/adminRepository')
const Category = require('../domain/model/category')
const subCategory = require('../domain/model/subCategory')
const owner=require('../domain/model/owner')

const auth = async (req) => {
     const { email, password } = req.body
     if (!email && !password) {
          return { status: 403 }
     }
     try {
          const admin = await adminRepository.findAdminByEmail(email)
          if (!admin) return { status: 403 }

          const checkedPassword = await bcrypt.compare(password, admin.password)


          if (admin && checkedPassword) {
               if (admin.isAdmin) {
                    req.session.admin = email;
                    return { status: 200 }
               }
          }
          else return { status: 400 }
     }
     catch (error) {
          console.log(error);
     }
}

const adminUsername = async (email) => {
     try {
          const adminData = await adminRepository.findAdminNameByEmail(email)
          const name = adminData.name
          return name
     } catch (err) { console.log(err); }
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

const authenticateOwner= async (req)=>{
  
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

          const newOwner=new owner({
               owner_name:first_name,
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



module.exports = {
     auth,
     adminUsername,
     saveNewCategory,
     saveNewSubCategory,
     findRequests,
     approve,
     authenticateOwner
}

