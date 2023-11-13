const adminService = require('../../service/adminService')
const report = require('../../utils/salesReport')

const adminLogin = (req, res) => {
  const msg = req.query.msg
  res.render('admin-login', { msg })
}

const adminAuthentication = async (req, res) => {
  try {
    console.log(req.body,"99999")
    const response = await adminService.auth(req)
    if (response.status === 401) res.redirect(`/admin?msg=${response.msg}`)
    if (response.status === 200) res.redirect('/admin/home')
  } catch (error) { console.log(error); }
}
const adminHome = async (req, res) => {
  try {
    var NoOfBookings
    var dates = []
    var revenue = []
    var total = 0
    const email = req.session.admin
    const name = await adminService.adminUsername(email)
    const data = await adminService.findAlldetails()
    data.forEach((element, index) => {
      total += (element.otherDetails.moneyPaid + element.otherDetails.pendingAmount)
      // var date = element.checkin_date
      // date = date.split('T')
      // console.log(date,"date");
      // dates.push(date)
      revenue.push((element.otherDetails.moneyPaid + element.otherDetails.pendingAmount))
      NoOfBookings = index + 1

    })
    total = total.toFixed(2)
    const noOfUsers = await adminService.findAllUsers()

    console.log(dates, revenue, "dates");

    res.render('adminHome', { username: name, noOfUsers, NoOfBookings, total })
  } catch (err) { console.log(err); }
}

const categoryManagement = (req, res) => {
  res.redirect('/admin/categoryManagementPage')
}
const categoryManagementPage = (req, res) => {
  try {
    const msg1 = req.query.msg1
    const msg2 = req.query.msg2
    res.render('admin-forms', { msg1, msg2 })
  } catch (err) { console.log(err); }
}
const saveCategory = async (req, res) => {
  try {
    const response = await adminService.saveNewCategory(req)
    console.log(response);
    if (response.status === 200) res.redirect(`/admin/categoryManagementPage?msg1=${response.message}`)
    if (response.status === 400) res.redirect(`/admin/categoryManagementPage?msg1=${response.message}`)
  } catch (error) { console.log(error); }

}

const saveSubCategory = async (req, res) => {
  try {
    const response = await adminService.saveNewSubCategory(req)
    console.log(response);
    if (response.status === 200) res.redirect(`/admin/categoryManagementPage?msg2=${response.message}`)
    if (response.status === 400) res.redirect(`/admin/categoryManagementPage?msg2=${response.message}`)
  } catch (error) { console.log(error); }

}

const hotelRequests = (req, res) => {
  res.redirect('/admin/aproveHotelList')
}

const hotelRequestView = async (req, res) => {
  try {
    const items = await adminService.findRequests(req)
    console.log(items);
    const msg = req.query.msg
    res.render('admin-requests', { items: items, msg: msg })
  } catch (error) { console.log(error); }
}

const requestApprove = async (req, res) => {
  try {
    const response = await adminService.approve(req)
    if (response.status === 200) res.redirect(`/admin/aproveHotelList?msg=${response.msg}`)
    if (response.status === 400) res.redirect(`/admin/aproveHotelList?msg=${response.msg}`)
  } catch (error) { console.log(error); }

}
const ownerManagement = (req, res) => {
  res.redirect('/admin/ownerMangementPage')
}
const ownerMangementPage = (req, res) => {
  const msg = req.query.msg
  res.render('admin-ownerManagement', { msg })
}
const addNewOwner = async (req, res) => {
  try {
    const response = await adminService.authenticateOwner(req)
    console.log(response);
    if (response.status === 200) res.redirect(`/admin/ownerMangementPage?msg=${response.message}`)
    if (response.status === 400) res.redirect(`/admin/ownerMangementPage?msg=${response.message}`)
  } catch (error) { console.log(error); }
}

const couponManagement = (req, res) => {
  try {
    res.redirect('/admin/couponManagementPage')
  } catch (err) { console.log(err); }
}

const couponManagementPage = async (req, res) => {
  try {
    let msg = req.query.msg
    const coupons = await adminService.existingCoupons()

    const modifiedCoupons = coupons.map(coupon => {
      return {
        ...coupon,
        startingDate: coupon.startingDate.toISOString().split('T')[0],
        expiry: coupon.expiry.toISOString().split('T')[0],
        discount: coupon.discount,
        name: coupon.name
      };
    });

    if (coupons.length === 0) { msg = coupons.msg }
    res.render('adminCouponManagement', { coupons: modifiedCoupons, msg })
  } catch (err) { console.log(err); }
}
const addCoupon = async (req, res) => {
  try {
    const response = await adminService.addCoupon(req)
    if (response.status === 200) res.redirect(`/admin/couponManagementPage?msg=${response.msg}`)
  } catch (err) { console.log(err); }
}

const signOut = (req, res) => {
  try {
    delete req.session.admin
    res.redirect('/admin')

  } catch (err) { console.log(err.message); }
}

const salesReport = async (req, res) => {
  try {


    const data = await adminService.findSalesReport(req.body)
    console.log(data, "data");
    if (data) {
      await report.createSalesReport(data, res)

    } else res.redirect('/admin')
  } catch (err) { console.log(err.message); }
}

const salesReportSelected = async (req, res) => {
  try {
    console.log(req.body, "req.body");
    const { timeRange } = req.body

    if (timeRange === "week") {
      const year = 2023;
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      let weeklyReports = [];


      let currentWeekStartDate = new Date(startDate);
      let currentWeekEndDate = new Date(startDate);

      currentWeekEndDate.setDate(currentWeekEndDate.getDate() + 6);
      currentWeekStartDate.setHours(5, 30, 0, 0);
      currentWeekEndDate.setHours(5, 30, 0, 0);

      while (currentWeekStartDate <= endDate) {
        const report = await adminService.findSalesReportSelected(currentWeekStartDate, currentWeekEndDate);
        weeklyReports.push(report);


        currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
        currentWeekEndDate = new Date(currentWeekStartDate);
        currentWeekEndDate.setDate(currentWeekEndDate.getDate() + 6);
      }

      weeklyReports = weeklyReports.reverse()
      await report.salesReportWeekly(weeklyReports, res)
    }
    if (timeRange === "month") {
      const year = 2023;
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      let monthlyReports = [];

      let currentMonthStartDate = new Date(startDate);
      let currentMonthEndDate = new Date(startDate);

      currentMonthEndDate.setMonth(currentMonthEndDate.getMonth() + 1);
      currentMonthEndDate.setDate(currentMonthEndDate.getDate() - 1);
      currentMonthStartDate.setHours(5, 30, 0, 0);
      currentMonthEndDate.setHours(5, 30, 0, 0);

      while (currentMonthStartDate <= endDate) {
        const report = await adminService.findSalesReportSelected(currentMonthStartDate, currentMonthEndDate);
        monthlyReports.push(report);

        currentMonthStartDate.setMonth(currentMonthStartDate.getMonth() + 1);
        currentMonthEndDate = new Date(currentMonthStartDate);
        currentMonthEndDate.setMonth(currentMonthEndDate.getMonth() + 1);
        currentMonthEndDate.setDate(currentMonthEndDate.getDate() - 1);
      }

      monthlyReports = monthlyReports.reverse();
      console.log(monthlyReports, "monthlyReports");
      report.salesReportMonthly(monthlyReports, res);
    }

  } catch (err) {
    console.log(err.message);
  }
}

const salesRevenueInGraph = async (req, res) => {
  try {
    console.log(11111111111111111)
    console.log(req.body, "req.body1111");
    const { timeRange } = req.body

    if (timeRange === "week") {
      const year = 2023;
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      let weeklyReports = [];


      let currentWeekStartDate = new Date(startDate);
      let currentWeekEndDate = new Date(startDate);

      currentWeekEndDate.setDate(currentWeekEndDate.getDate() + 6);
      currentWeekStartDate.setHours(5, 30, 0, 0);
      currentWeekEndDate.setHours(5, 30, 0, 0);

      while (currentWeekStartDate <= endDate) {
        const report = await adminService.findSalesReportSelected(currentWeekStartDate, currentWeekEndDate);
        weeklyReports.push(report);


        currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
        currentWeekEndDate = new Date(currentWeekStartDate);
        currentWeekEndDate.setDate(currentWeekEndDate.getDate() + 6);
      }

      weeklyReports = weeklyReports.reverse()
      res.json({ success: weeklyReports })
    }
    if (timeRange === "month") {
      const year = 2023;
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      let monthlyReports = [];

      let currentMonthStartDate = new Date(startDate);
      let currentMonthEndDate = new Date(startDate);

      currentMonthEndDate.setMonth(currentMonthEndDate.getMonth() + 1);
      currentMonthEndDate.setDate(currentMonthEndDate.getDate() - 1);
      currentMonthStartDate.setHours(5, 30, 0, 0);
      currentMonthEndDate.setHours(5, 30, 0, 0);

      while (currentMonthStartDate <= endDate) {
        const report = await adminService.findSalesReportSelected(currentMonthStartDate, currentMonthEndDate);
        monthlyReports.push(report);

        currentMonthStartDate.setMonth(currentMonthStartDate.getMonth() + 1);
        currentMonthEndDate = new Date(currentMonthStartDate);
        currentMonthEndDate.setMonth(currentMonthEndDate.getMonth() + 1);
        currentMonthEndDate.setDate(currentMonthEndDate.getDate() - 1);
      }


      console.log(monthlyReports, "monthlyReports");
      res.json({ success: monthlyReports })
    }

  } catch (err) {
    console.log(err.message);
  }
}
module.exports = {
  adminLogin,
  adminAuthentication,
  adminHome,
  categoryManagement,
  categoryManagementPage,
  saveCategory,
  saveSubCategory,
  hotelRequests,
  hotelRequestView,
  requestApprove,
  ownerManagement,
  ownerMangementPage,
  addNewOwner,
  couponManagement,
  couponManagementPage,
  addCoupon,
  signOut,
  salesReportSelected,
  salesReport,
  salesRevenueInGraph
}