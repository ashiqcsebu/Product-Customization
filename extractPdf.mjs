import fs from 'fs';
import pdfParse from './apps/api/node_modules/pdf-parse/lib/pdf-parse.js';

const dataBuffer = fs.readFileSync('Dynamic pricing calculator.pdf');

pdfParse(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (err) {
    console.error("Error reading PDF:", err);
});
