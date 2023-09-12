const ownerRepository=require('../repository/ownerRepository')
const bcrypt=require('bcryptjs')
const upload=require('../interface/controller/uploadImages')

const auth = async(req)=>{
    const { email, password } = req.body
    if (!email && !password) {
         return {status:403}
    }
    try {
         const owner = await ownerRepository.findOwnerByEmail(email)
         

         const checkedPassword = await bcrypt.compare(password, owner.password)
         if (owner && checkedPassword) {
              if (owner.isOwner) {
                  req.session.owner=email
                 return {status:200}
              }
            }
         else  return {status:400}

    }
    catch (error) {
         console.log(error);
    }

}

const ownerUsername= async (email)=>{
          console.log(email);
          const ownerData= await  ownerRepository.findOwnerNameByEmail(email)   
          const {owner_name}=ownerData  
          console.log(owner_name);  
    return owner_name
}

const authHotel= async (req)=>{
     console.log(req.body);

try{
     const {owner_id,hotel_name,email,address,city,pincode,totalRoomsAvailable,nearTouristDestination}=req.body

     if(!owner_id || !hotel_name || !email || !address || !city ||!pincode ||!totalRoomsAvailable ||!nearTouristDestination){
          console.log("fill emplty fields");
          return {status:400}
     }
     const hotelData= await ownerRepository.FindHotelByName(hotel_name)            

     
          if(hotelData){
               console.log('hotel already exists');
               return {status:400}
          }
          else{
               const newHotel=new hotel({
                    owner_id,
                    hotel_name,
                    email,
                    address,
                    city,
                    pincode,
                    totalRoomsAvailable,
                    nearTouristDestination
               })
               newHotel.save()
            return {status:200}
          
          }
     
     }
catch(error){console.log(error);}
}





const uploadImagesService =  (req,res) => {
     
    upload.array('images', 5)(req,res, (err) => {
       if (err) {
         console.log(err);
       }
   
       const imageUrls = req.files.map(file => file.path);
       console.log(imageUrls);
     });
   }
   

module.exports = {
     auth,
     ownerUsername,
     authHotel,
     uploadImagesService
}
