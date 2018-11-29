const sharp = require('sharp');

exports.resizeFromBuffer = (buff, h, w, quality) => {
    sharp(buff)
        .jpeg()
        .resize(w, h)
        .toBuffer((err, buff, info) => {
            if (err)
                console.log(err);

            if (buff) {
                return buff;
            }
        });
};

exports.changeQualityFromBuffer = (buff, quality) => {
    return sharp(buff)
        .quality(quality)
        .toBuffer();
};