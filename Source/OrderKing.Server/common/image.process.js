const sharp = require('sharp');

exports.resizeFromBuffer = (buff, h, w, quality) => {
    return sharp(buff).resize(w, h)
        .quality(quality)
        .toBuffer();
};

exports.changeQualityFromBuffer = (buff, quality) => {
    return sharp(buff)
        .quality(quality)
        .toBuffer();
};