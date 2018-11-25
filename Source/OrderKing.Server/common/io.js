var fs = require('fs');

exports.readFileToBinary = (filename) => {
    let data = fs.readFileSync(filename);
    return data;
};