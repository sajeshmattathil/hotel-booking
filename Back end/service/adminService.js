const bcrypt = require('bcryptjs')
const adminRepository = require('../repository/adminRepository')
const hotels=require('../domain/model/hotel')

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


const findRequests = async () => {
try{
     const requestDatas = await adminRepository.findHotelApprovalRequests()
     console.log(requestDatas);
     if(requestDatas) return requestDatas
     else console.log('requestDatas not found');

}catch(error){console.log(error);}
}

const approve = async (req) => {

     const email = req.params.email
     const filter = { email: email };
     const update = { $set: { isApproved: true } };

     await hotels.updateOne(filter, update)
          .then(() => {
               return { status: 200 }
          })
          .catch(error => {
               console.log(error);
          });
}





module.exports = {
     auth,
     adminUsername,
     findRequests,
     approve
}

