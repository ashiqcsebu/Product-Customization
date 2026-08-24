const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('Dynamic pricing calculator.pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (err) {
    console.error("Error reading PDF:", err);
});
