import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const dataBuffer = fs.readFileSync('../Dynamic pricing calculator.pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (err) {
    console.error("Error reading PDF:", err);
});
