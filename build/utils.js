/**
 * @createDate: 2021/3/15
 * @author: wen_dell
 * @email: wendell.chen@chinaentropy.com
 * **/
const path = require('path');
const config = require('./../config/index.js');

exports.assetsPath = function(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory;

    return path.posix.join(assetsSubDirectory, _path)
};
