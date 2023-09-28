const User=require('../domain/model/user')
const hotels=require('../domain/model/hotel')
const rooms=require('../domain/model/room')
const bookings=require('../domain/model/bookings')
const bcrypt=require('bcryptjs')

const findUserByEmail=async (email)=>{
    try {
        return await User.findOne({email:email})
    } catch (error) {
        console.log(error);
    }
}

const findAllHotels= async (cityName)=>{
    try {  
        if(cityName){ const data= await hotels.find({isApproved:true,city:cityName}).limit(10)
        if(data.length === 0){
            return await hotels.find({isApproved:true})
        }
        return data
    }
        else console.log('cityName not found');
        
    } catch (error) {
        console.log(error);
    }
}
const findAndEditName= async (req)=>{
    try{
        const email=req.session.user
        const {first_name,last_name}=req.body
        console.log(first_name+"??????????");
        return await User.updateOne({email:email},{$set:{first_name:first_name,last_name:last_name}})
    }catch(err){console.log(err);}
}
const findAndEditEmail= async (req)=>{
    try{
        const email=req.session.user
        const newEmail=req.body.email
        req.session.user=newEmail
        return await User.updateOne({email:email},{$set:{email:newEmail}})
    }catch(err){console.log(err);}
}

const findAndEditMobile= async (req)=>{
    try{
        const email=req.session.user
        const mobile=req.body.mobile
        return await User.updateOne({email:email},{$set:{mobile:mobile}})
    }catch(err){console.log(err);}
}

const findAndEditGender= async (req)=>{
    try{
        const email=req.session.user
        const gender=req.body.gender
        return await User.updateOne({email:email},{$set:{gender:gender}})
    }catch(err){console.log(err);}
}

const findAndEditAddress= async (req)=>{
    try{
        const email=req.session.user
        const {address,city,pin}=req.body
        return await User.updateOne({email:email},{$set:{'addressDetails.address':address,'addressDetails.city':city,'addressDetails.pin':pin}})
    }catch(err){console.log(err);}
}

const findAndEditPassword= async (req)=>{
    try{
        const email=req.session.user
        const {password}=req.body
        console.log(password);
        const hashPassword = await bcrypt.hash(password, 10)
        return await User.updateOne({email:email},{$set:{password:hashPassword}})
    }catch(err){console.log(err);}
}

const findAndChangePassword= async (req)=>{
    try{
        const email=req.session.email
        const {password}=req.body
        const hashPassword = await bcrypt.hash(password, 10)
        return await User.updateOne({email:email},{$set:{password:hashPassword}})
    }catch(err){console.log(err);}
}

const sortBy = async (req) =>{
try{
    const cityName= req.session.city
    const sort=req.query.sort
    const sortCriteria = {};
    sortCriteria[sort] = -1; 
    return hotels.find({city:cityName}).sort(sortCriteria)
        
    
}catch(err){console.log(err.message);}

}

const roomDetails = async(hotelId)=>{
    try{
        const roomArray = await rooms.aggregate([
            {
              $group: {
                _id: "$roomType", 
                price: { $addToSet: "$price" } 
              }
            },
            {
              $project: {
                type: "$roomType", 
                price: 1 
              }
            }
          ]);
          console.log(roomArray,"\\\\\@@@@@@@/////");
          
        return roomArray;
        
    }catch(err){console.log(err);}
}

const roomImages =async(hotelId)=>{
    try{
        const images = await hotels.findOne({_id:hotelId}).lean()
        return images;
        
    }catch(err){console.log(err);}
}

const selectedRoomDetails= async (roomType)=>{
    try{
        return await rooms.findOne({roomType:roomType})
    }catch(err){console.log(err);}

}

const selectedHotelDetails=async(hotelId)=>{
    try{
        return await hotels.findOne({_id:hotelId})
    }catch(err){console.log(err);}
}

const saveBooking= async (req)=>{
    try{
        const {name,email,phone}=req.body
        const roomData=req.session.roomData
        const hotelData=req.session.hotelData
        const checkin_date = req.session.checkin_date
        console.log(checkin_date);

        const checkout_date = req.session.checkout_date
        console.log(checkout_date);

        const user=req.session.user
        const id='65156b5bdbdae866bd4b69bc'

        function convertDateFormat(dateString) {
            const months = {
                January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
                July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
            };
        
            const [day, month, year] = dateString.split(' ');
        
            return `${year}-${months[month]}-${day}`;
        }
        
        const originalDate = "28 September, 2023";
        const startDate = convertDateFormat(checkin_date);
        const endDate = convertDateFormat(checkout_date);
        console.log(startDate,"888888");

        
        console.log(endDate,"999999"); // Output: "2023-09-28"
        

        const  newBooking={
            userName:user,
            name:name,
            email:email,
            hotel_name:hotelData.hotel_name,
            room:roomData.roomType,
            checkin_date:checkin_date,
            checkout_date:checkout_date,
            status:'pending'

        }

        const selectedRoom=await rooms.findOne({
            $nor: [
                    {"bookingDetails.checkin_date":{$gt:startDate}},
                    {"bookingDetails.checkout_date":{$lt:endDate}}
                 ]
        })
        console.log(selectedRoom,'[][][][]');
             await rooms.updateOne({_id:selectedRoom._id},{$push:{bookingDetails:newBooking}})
             const  pendingBookings={
                userName:user,
                name:name,
                email:email,
                hotel_name:hotelData.hotel_name,
                room:roomData.roomType,
                checkin_date:checkin_date,
                checkout_date:checkout_date,
                room_no:selectedRoom.roomNumber,
                status:'pending'
    
            }

        await bookings.updateOne({_id:id},{$push:{bookedData:pendingBookings}})


    }catch(err){console.log(err);}
}

module.exports={
    findUserByEmail,
    findAllHotels,
    findAndEditName,
    findAndEditEmail,
    findAndEditMobile,
    findAndEditGender,
    findAndEditAddress,
    findAndEditPassword,
    findAndChangePassword,
    
    sortBy,
    roomDetails,
    roomImages,
    selectedRoomDetails,
    selectedHotelDetails,
    saveBooking
}