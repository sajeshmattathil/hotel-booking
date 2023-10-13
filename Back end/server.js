require('dotenv').config();
const db = require('./config/dbconnect')
db()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const ejs = require('ejs')
const nocache = require('nocache')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const userRouter = require('./interface/routes/userRoutes')
const adminRouter = require('./interface/routes/adminRoutes')
const ownerRouter = require('./interface/routes/ownerRoutes')
const referal = require('../Back end/utils/referalCodeGenerator')

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


app.use('/static', express.static(path.join(__dirname, '../Front end/public')));
app.set('views', path.join(__dirname, '../Front end/views'));


app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:6000000}
}))
app.use(nocache())
app.use('/', userRouter)
app.use('/admin', adminRouter)
app.use('/owner', ownerRouter)

function removeDuplicates(firstArray, secondArray) {
    return secondArray.filter(item => !firstArray.includes(item));
}

const firstArray = [1, 2, 3, 4, 5];
const secondArray = [4, 5, 6, 7, 8];

const resultArray = removeDuplicates(firstArray, secondArray);
console.log(resultArray);


app.listen(8080, () => { console.log('Listening to the server on http://localhost:8080'); })