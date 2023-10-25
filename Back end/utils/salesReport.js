const Excel = require('exceljs');
const fs = require('fs')

const createSalesReport = (data, res) => {


    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 3 },
        { header: 'Name', key: 'username', width: 20 },
        { header: 'Hotel Name', key: 'hotelname', width: 12 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'Booking Status', key: 'status', width: 15 },
        { header: 'Check In', key: 'checkin', width: 10 },
        { header: 'Check Out', key: 'checkout', width: 10 },
        { header: 'Amount', key: 'amount', width: 9 },


    ];
    data.forEach((element, index) => {
        worksheet.addRow({
            id: index + 1,
            username: element.userName,
            checkin: element.checkin,
            checkout: element.checkout,
            hotelname: element.hotelName,
            city: element.city,
            status: element.status,
            amount: element.amount
        });

    })


    workbook.xlsx.writeFile('sales.xlsx')
        .then(function () {
            console.log('File saved!');



            const salesPath = 'C:/Users/Sajesh.M/Desktop/Weekly Tasks/Week 11/Hotel Booking/Back end/sales.xlsx'

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.download(salesPath, 'sales.xlsx', (err) => {
                if (err) {
                    console.error('Error sending sales report', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    fs.unlink(salesPath, (err) => {
                        if (err) {
                            console.error('Error deleting sales report file', err);
                        } else {
                            console.log('Sales report file deleted successfully');
                        }
                    });
                }
            });
        });
}

const salesReportWeekly = (report, res) => {


    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
        { header: 'Week No.', key: 'id', width: 10 },
        { header: 'Name', key: 'username', width: 20 },
        { header: 'Hotel Name', key: 'hotelname', width: 12 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'Booking Status', key: 'status', width: 15 },
        { header: 'Check In', key: 'checkin', width: 10 },
        { header: 'Check Out', key: 'checkout', width: 10 },
        { header: 'Amount', key: 'amount', width: 9 },


    ];
    let weekCount = report.length +1
    for(let i = 0 ; i<report.length;i++){
        weekCount--
            report[i].forEach((element, index) => {
               
                worksheet.addRow({
                    id: `week ${weekCount}`,
                    username: element.userName,
                    checkin: element.checkin,
                    checkout: element.checkout,
                    hotelname: element.hotelName,
                    city: element.city,
                    status: element.status,
                    amount: element.amount
                });
            
        
            })
        
    }
    //console.log();


    workbook.xlsx.writeFile('salesweekly.xlsx')
        .then(function () {
            console.log('File saved!');



            const salesPath = 'C:/Users/Sajesh.M/Desktop/Weekly Tasks/Week 11/Hotel Booking/Back end/salesweekly.xlsx'

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.download(salesPath, 'salesweekly.xlsx', (err) => {
                if (err) {
                    console.error('Error sending sales report', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    fs.unlink(salesPath, (err) => {
                        if (err) {
                            console.error('Error deleting sales report file', err);
                        } else {
                            console.log('Sales report file deleted successfully');
                        }
                    });
                }
            });
        });
}
const salesReportMonthly = (report, res) => {


    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = [
        { header: 'Month.', key: 'id', width: 10 },
        { header: 'Name', key: 'username', width: 20 },
        { header: 'Hotel Name', key: 'hotelname', width: 12 },
        { header: 'City', key: 'city', width: 10 },
        { header: 'Booking Status', key: 'status', width: 15 },
        { header: 'Check In', key: 'checkin', width: 10 },
        { header: 'Check Out', key: 'checkout', width: 10 },
        { header: 'Amount', key: 'amount', width: 9 },
    ];
    let weekCount = report.length +1
    for(let i = 0 ; i<report.length;i++){
        weekCount--
            report[i].forEach((element, index) => {
               
                worksheet.addRow({
                    id: `month ${weekCount}`,
                    username: element.userName,
                    checkin: element.checkin,
                    checkout: element.checkout,
                    hotelname: element.hotelName,
                    city: element.city,
                    status: element.status,
                    amount: element.amount
                });
            
        
            })
        
    }
    //console.log();


    workbook.xlsx.writeFile('salesmonthly.xlsx')
        .then(function () {
            console.log('File saved!');



            const salesPath = 'C:/Users/Sajesh.M/Desktop/Weekly Tasks/Week 11/Hotel Booking/Back end/salesmonthly.xlsx'

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.download(salesPath, 'salesmonthly.xlsx', (err) => {
                if (err) {
                    console.error('Error sending sales report', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    fs.unlink(salesPath, (err) => {
                        if (err) {
                            console.error('Error deleting sales report file', err);
                        } else {
                            console.log('Sales report file deleted successfully');
                        }
                    });
                }
            });
        });
}

module.exports ={ 
    createSalesReport,
    salesReportWeekly,
    salesReportMonthly
}