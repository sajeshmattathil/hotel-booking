const ownerRepository = require('../repository/ownerRepository')
const hotel = require('../domain/model/hotel')
const bcrypt = require('bcryptjs')

const auth = async (req) => {
     const { email, password } = req.body
     if (!email && !password) {
          return { status: 403 }
     }
     try {
          const owner = await ownerRepository.findOwnerByEmail(email)


          const checkedPassword = await bcrypt.compare(password, owner.password)
          if (owner && checkedPassword) {
               if (owner.isOwner) {
                    req.session.owner = email
                    return { status: 200 }
               }
          }
          else return { status: 400 }

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

module.exports = {
     auth,
     ownerUsername,
     authHotel,
}
