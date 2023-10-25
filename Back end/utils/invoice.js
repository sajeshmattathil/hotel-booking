

const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

const generateInvoice = async (bookingDetails, invoiceNumber,res) => {
console.log(bookingDetails, invoiceNumber,"bookingDetails, invoiceNumber");
    const gst = bookingDetails[0].amount -(((100-12)/100) * bookingDetails[0].amount)
    const price = bookingDetails[0].amount -(((12)/100) * bookingDetails[0].amount)
    const invoiceData = {
        invoiceNumber: invoiceNumber,
        invoiceDate: bookingDetails[0].checkout,
        email:bookingDetails[0].userName,
        amount:bookingDetails[0].amount,
        gst:gst,
        price:price,
        room:bookingDetails[0].roomType,
        hotelName:bookingDetails[0].hotelName,
        checkout:bookingDetails[0].checkout,
        checkin:bookingDetails[0].checkin
    };
    console.log(invoiceData,"invoiceData");
    const templatePath = 'C:/Users/Sajesh.M/Desktop/Weekly Tasks/Week 11/Hotel Booking/Front end/views/user/invoice.ejs'
    fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
            console.error('Error reading template:', err);
            return;
        }
        template = template.replace('{{invoiceNumber}}', invoiceData.invoiceNumber);
        template = template.replace('{{invoiceDate}}', invoiceData.invoiceDate);
        template = template.replace('{{email}}', invoiceData.email);
        template = template.replace('{{price}}', invoiceData.price);
        template = template.replace('{{gst}}', invoiceData.gst);
        template = template.replace('{{amount}}', invoiceData.amount);
        template = template.replace('{{room}}', invoiceData.room);
        template = template.replace('{{hotelName}}', invoiceData.hotelName);
        template = template.replace('{{checkout}}', invoiceData.checkout);
        template = template.replace('{{checkin}}', invoiceData.checkin);


        pdf.create(template).toFile('invoice.pdf', (err, response) => {
            if (err) {
                console.error('Error generating PDF:', err);
                return;
            }

            console.log('Invoice generated at', response.filename);
        });
    });

    const invoicePath = 'C:/Users/Sajesh.M/Desktop/Weekly Tasks/Week 11/Hotel Booking/Back end/invoice.pdf'
    res.download(invoicePath, 'invoice.pdf', (err) => {
        if (err) {
            console.error('Error sending invoice:', err);
            res.status(500).send('Internal Server Error');
        } else {
            fs.unlinkSync(invoicePath);
        }
    });
}

module.exports = generateInvoice;
