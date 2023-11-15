const Admin = require('../domain/model/Admin')
const hotels = require('../domain/model/hotel')
const category = require('../domain/model/category')
const subcategory = require('../domain/model/subCategory')
const owner = require('../domain/model/owner')
const coupons = require('../domain/model/coupon')
const bookingHistory = require('../domain/model/bookingHistory')
const users = require('../domain/model/user')

const findAdminByEmail = async (email) => {
    try {
        return await Admin.findOne({ email: email })
    } catch (error) {
        console.log(error);
    }
}

const findAdminNameByEmail = async (email) => {
    try {
        return await Admin.findOne({ email: email }, { _id: 0, name: 1 }).lean()
    } catch (error) {
        console.log(error);
    }
}

const findHotelApprovalRequests = async () => {
    try {
        return await hotels.find({ isApproved: false }, { hotel_name: 1, owner_id: 1, email: 1 })
    } catch (error) {
        console.log(error);
    }
}

const findHotelAndApprove = async (email) => {
    try {
        console.log(email);
        return await hotels.updateOne({ email: email }, { $set: { isApproved: true } })
    } catch (error) {
        console.log(error);
    }
}
const findCategoryByName = async (name) => {
    try {
        return await category.findOne({ name: name })
    } catch (error) {
        console.log(error);
    }
}

const findSubCategoryByName = async (name) => {
    try {

        return await subcategory.findOne({ name: name })
    } catch (error) {
        console.log(error);
    }
}

const findOwnerByEmail = async (email) => {
    try {

        return await owner.findOne({ email: email })
    } catch (error) {
        console.log(error);
    }
}

const findExistingCoupons = async () => {
    try {
        const today = new Date()
        const todayDate = today.toISOString().split('T')[0]
        return await coupons.find({ expiry: { $gte: todayDate } })
    } catch (error) {
        console.log(error);
    }
}

const updateAdminWallet = async (adminAmout) => {
    try {
        const adminData = await Admin.find({})
        console.log(adminData, "adminData");
        console.log(adminData[0]._id, "adminData[0]._id");

        return await Admin.updateOne({ _id: adminData[0]._id }, { $inc: { wallet: adminAmout } })
    } catch (err) { console.log(err); }
}

const findAdmin = async () => {
    try {
        return await Admin.find({})
    } catch (err) { console.log(err.message); }
}

const findsales = async () => {
    try {
        return await bookingHistory.find({ status: { $ne: "cancelled" } })
    } catch (err) { console.log(err.message); }
}
const findAllUsers = async () => {
    try {
        return await users.find({}).count()
    } catch (err) { console.log(err.message); }
}

const findSalesData = async (startDate, endDate) => {
    try {
        console.log(startDate, endDate, "startDate,endDate");
        return await bookingHistory.aggregate([
            {
                $match: { checkin_date: { $gte: startDate }, checkout_date: { $lte: endDate },status:'completed' }

            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: 'hotel_id',
                    foreignField: '_id',
                    as: 'hotelInfo'
                }
            },
            {
                $unwind: '$hotelInfo'
            },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'room_id',
                    foreignField: '_id',
                    as: 'roomInfo'
                }
            },
            {

                $unwind: '$roomInfo'
            },
            {
                $project: {
                    userName: 1,
                    status: "$status",
                    checkin: "$checkin_date",
                    checkout: "$checkout_date",
                    hotelName: "$hotelInfo.hotel_name",
                    roomType: "$roomInfo.roomType",
                    city: "$hotelInfo.city",
                    amount: "$otherDetails.moneyPaid"
                }
            }, {
                $sort: {
                    checkin: 1
                }
            }

        ])
    } catch (err) { console.log(err.message); }
}

module.exports = {
    findAdminByEmail,
    findAdminNameByEmail,
    findHotelApprovalRequests,
    findHotelAndApprove,
    findCategoryByName,
    findSubCategoryByName,
    findOwnerByEmail,
    findExistingCoupons,
    updateAdminWallet,
    findAdmin,
    findsales,
    findAllUsers,
    findSalesData
}