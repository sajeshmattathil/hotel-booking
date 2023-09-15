const bcrypt = require('bcryptjs')
const adminRepository = require('../repository/adminRepository')
const Category=require('../domain/model/category')

const auth = async (req) => {
     const { email, password } = req.body
     if (!email && !password) {
          return { status: 403 }
     }
     try {
          const admin = await adminRepository.findAdminByEmail(email)
          console.log(admin);

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
     const adminData = await adminRepository.findAdminNameByEmail(email)
     const { name } = adminData
     return name
}

const saveNewCategory = (req) => {
     try {
          
          const name=req.body.category
          if(!name) {
               const msg="Something went wrong"
               return {status:400,message:msg}
          }
          const newCategory = new Category({
               name:name
          })
          newCategory.save()
          const msg="Category added sucessfully"
          return {status:200,message:msg}
     } catch (error) { console.log(error.message)
          const msg="Something went wrong"
          return {status:400,message:msg}
          ; }
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
     try{
     const email = req.params.email
     const requestDatas = await adminRepository.findHotelAndApprove(email)
     if (requestDatas) {
          const msg="Request approved"
          return { status: 200 ,msg:msg }
     }
     else {
          const msg = 'Something went wrong'
          return { status: 400, msg: msg }
     }
     }catch(error){console.log(error);}

}





module.exports = {
     auth,
     adminUsername,
     saveNewCategory,
     findRequests,
     approve
}

