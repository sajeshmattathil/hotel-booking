const ownerRepository = require('../repository/ownerRepository')
const hotel = require('../domain/model/hotel')
const bcrypt = require('bcryptjs')

const auth = async (req) => {
     const { email, password } = req.body
     if (!email && !password) {
          const msg = "Fill empty fields"
          return { status: 403, msg: msg }
     }
     try {
          const owner = await ownerRepository.findOwnerByEmail(email)
          if (owner.email !== email) {
               const msg = "Email or Password is incorrect"
               return { status: 400, msg: msg }
          }
          const checkedPassword = await bcrypt.compare(password, owner.password)
          if (owner && checkedPassword) {
               if (owner.isOwner) {
                    req.session.owner = email
                    return { status: 200 }
               }
          }
          else {
               const msg = "Something wnt wrong"
               return { status: 400, msg: msg }
          }
     }
     catch (error) {
          console.log(error);
     }

}

const ownerUsername = async (email) => {
     console.log(email);
     const ownerData = await ownerRepository.findOwnerNameByEmail(email)
     const { owner_name } = ownerData
     console.log(owner_name);
     return owner_name
}

const authHotel = async (req) => {

     try {
          const image = req.files.map(file => file.filename);

          const { owner_id, hotel_name, email, address, city, pincode, totalRoomsAvailable, nearTouristDestination } = req.body

          if (!owner_id || !hotel_name || !email || !address || !city || !pincode || !totalRoomsAvailable || !nearTouristDestination) {
               console.log("fill empty fields");
               let msg = 'fill empty fields'
               return { status: 400, msg: msg }
          }
          const hotelData = await ownerRepository.FindHotelByName(hotel_name)

          if (hotelData) {
               console.log('hotel already exists');
               let msg = 'hotel already exists'
               return { status: 400, msg: msg }

          }
          else {
               const newHotel = new hotel({
                    owner_id,
                    hotel_name,
                    email,
                    address,
                    city,
                    pincode,
                    totalRoomsAvailable,
                    nearTouristDestination,
                    imagesOfHotel: image
               })
               newHotel.save()
               let msg = 'Hotel saved successfully'
               return { status: 200, msg: msg }

          }

     }
     catch (error) { console.log(error); }
}


const hotelsWithIncompleteDetails= async (req,res)=>{
     try{
     const data= await ownerRepository.findHotelsWithIncompleteDetails()
     console.log(data);
     if(data.length === 0){
          let msg = 'No details available'
          return { status: 400, message: msg }
     }  
     // status 200          
     return data
     }catch(err){console.log(err);}
}



module.exports = {
     auth,
     ownerUsername,
     authHotel,
     hotelsWithIncompleteDetails,
    
}
