/**
 * @createDate: 2021/3/15
 * @author: wen_dell
 * @email: wendell.chen@chinaentropy.com
 * **/
const path = require('path');
const dev = require('./../config/dev');
const prod = require('./../config/prod');

exports.assetsPath = function(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? prod.assetsSubDirectory
        : dev.assetsSubDirectory;

    return path.posix.join(assetsSubDirectory, _path)
};
