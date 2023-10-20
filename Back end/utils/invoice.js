const fs = require('fs');
const PDFDocument = require('pdfkit');

const invoiceData = {
    invoiceNumber: 'INV-001',
    invoiceDate: '2023-10-17',
    // Add more data as needed
};

const templatePath = 'invoice_template.html';
const outputPath = 'invoice.pdf';

fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
        console.error('Error reading template:', err);
        return;
    }

    // Replace placeholders with actual data
    template = template.replace('{{invoiceNumber}}', invoiceData.invoiceNumber);
    template = template.replace('{{invoiceDate}}', invoiceData.invoiceDate);

    const doc = new PDFDocument();

    // Pipe the PDF content to a file
    doc.pipe(fs.createWriteStream(outputPath));

    // Embed the HTML content into the PDF
    doc.end(template);

    console.log(`Invoice generated at ${outputPath}`);
});
