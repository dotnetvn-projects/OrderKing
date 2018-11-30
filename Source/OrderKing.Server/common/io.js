var fs = require('fs');

exports.readFileToBinary = (filename) => {
    let data = fs.readFileSync(filename);
    return data;
};

exports.deleteFile = (filepath) => {
    fs.unlinkSync(filepath);
};