const db=require('./config/dbconnect')
db()
const express=require('express')
const app=express()
const ejs=require('ejs')
const nocache=require('nocache')
const session=require('express-session')
const {v4:uuidv4}=require('uuid')
const path=require('path')
const userRouter=require('./interface/routes/userRoutes')
const adminRouter=require('./interface/routes/adminRoutes')
const ownerRouter=require('./interface/routes/ownerRoutes')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')


app.use('/static', express.static(path.join(__dirname, '../Front end/public')));
app.set('views', path.join(__dirname, '../Front end/views'));
console.log(path.join(__dirname, '../Front end/public/himages'));


app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}))
app.use(nocache())
app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/owner',ownerRouter)


app.listen(8080,()=>{console.log('Listening to the server on http://localhost:8080');})