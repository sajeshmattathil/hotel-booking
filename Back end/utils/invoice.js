// const fs = require('fs');
// const PDFDocument = require('pdfkit');

// const generateInvoice = async (bookingDetails,invoiceNumber,res)=>{

// const invoiceData = {
//     invoiceNumber: 123456,
//     invoiceDate: '1316546465',

//     // invoiceNumber: invoiceNumber,
//     // invoiceDate: bookingDetails.checkout_date,
// };

// const templatePath = '../Front end/views/user/invoice.ejs';
// const outputPath = 'C:/Users/Sajesh.M/Desktop/Weekly Tasks/Week 11/Hotel Booking/Back end/invoice.pdf';


// fs.readFile(templatePath, 'utf8', (err, template) => {
//     if (err) {
//         console.error('Error reading template:', err);
//         return;
//     }

//     template = template.replace('{{invoiceNumber}}', invoiceData.invoiceNumber);
//     template = template.replace('{{invoiceDate}}', invoiceData.invoiceDate);

//     const doc = new PDFDocument();

//     doc.pipe(fs.createWriteStream(outputPath));

//     doc.end(template);
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
//     const readStream = fs.createReadStream(outputPath);
//     readStream.pipe(res);
//     console.log(`Invoice generated at ${outputPath}`);
//     try{
//     fs.unlink(outputPath, (err) => {
//         if (err) {
//             console.error('Error deleting PDF file:', err);
//         } else {
//             console.log('PDF file deleted successfully');
//         }
//     });
//     }catch(ere){console.log(err.message);}
// });


// }

// module.exports = generateInvoice



const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

const generateInvoice = async (bookingDetails, invoiceNumber,res) => {

    const gst = bookingDetails.amount -(((100-12)/100) * bookingDetails.amount)
    const price = bookingDetails.amount -(((12)/100) * bookingDetails.amount)
    const invoiceData = {
        invoiceNumber: invoiceNumber,
        invoiceDate: bookingDetails.checkout_date,
        email:bookingDetails.userName,
        amount:bookingDetails.amount,
        gst:gst,
        price:price,
        room:bookingDetails.roomType,
        hotelName:bookingDetails.hotelName,
        checkout:bookingDetails.checkout_date,
        checkin:bookingDetails.checkin_date
    };
    const templatePath = 'C:/Users/Sajesh.M/Desktop/Weekly Tasks/Week 11/Hotel Booking/Front end/views/user/invoice.ejs'
    fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
            console.error('Error reading template:', err);
            return;
        }
        template = template.replace('{{invoiceNumber}}', invoiceData.invoiceNumber);
        template = template.replace('{{invoiceDate}}', invoiceData.invoiceDate);
        template = template.replace('{{email}}', invoiceData.userName);
        template = template.replace('{{price}}', invoiceData.price);
        template = template.replace('{{gst}}', invoiceData.gst);
        template = template.replace('{{amount}}', invoiceData.amount);

        template = template.replace('{{room}}', invoiceData.roomType);
        template = template.replace('{{hotelName}}', invoiceData.hotelName);
        template = template.replace('{{checkout}}', invoiceData.checkout_date);
        template = template.replace('{{checkin}}', invoiceData.checkin_date);


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
