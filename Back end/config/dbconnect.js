const mongoose=require('mongoose')

// const dbConnect=async ()=>{ await mongoose.connect('mongodb://127.0.0.1:27017/hotelbooking').then(()=>{
//                      console.log("db is connected");}).catch((error)=>{console.log('error in db connection');})   }

//     module.exports=dbConnect

const dbConnect=async ()=>{ await mongoose.connect('mongodb+srv://sajeshmattathil:949740halla@cluster0.uhzzvba.mongodb.net/?retryWrites=true&w=majority').then(()=>{
                     console.log("db is connected");}).catch((error)=>{console.log('error in db connection');})   }

    module.exports=dbConnect  