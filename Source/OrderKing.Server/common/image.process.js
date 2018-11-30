const sharp = require('sharp');

exports.resize = (buff, h, w, callback) => {
    sharp(buff)
        .jpeg()
        .resize(w, h)
        .toBuffer((err, buff, info) => {
            if (err)
                console.log(err);

            if (buff) {
                callback(buff);
            }
        });
};

exports.resizeAutoScaleWidth = (buff, h, callback) => {
    sharp(buff)
        .jpeg()
        .resize({ height: h })
        .toBuffer((err, buff, info) => {
            if (err)
                console.log(err);

            if (buff) {
                callback(buff);
            }
        });
};

exports.resizeAutoScaleHeight = (buff, w, callback) => {
    sharp(buff)
        .jpeg()
        .resize({ width: w })
        .toBuffer((err, buff, info) => {
            if (err)
                console.log(err);

            if (buff) {
                callback(buff);
            }
        });
};