/**
 * @createDate: 2021/3/8
 * @author: wen_dell
 * @email: wendell.chen@chinaentropy.com
 * **/
'use strict';

const path = require('path');
const utils = require('./../build/utils');

let config = {
    dev: {
        assetsPublic: '/',
        assetsSubDirectory: 'static',
        devtool: 'source-map',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].[chunkhash].bundle.js',
        devServer: {
            hot: true,
            open: true,
            contentBase: false,
            compress: true,
            host: process.env.HOST || 'localhost',
            port: (process.env.PORT && Number(process.env.PORT)) || 8080,
            overlay: true,
        },
        proxy: {
            '/api': {
                target: '',
                changeOrigin: true,   // 是否跨域
                // secure: false,     // 如果是https接口，需要配置这个参数
                pathRewrite: {
                    '^/api': ''       // 重写路径
                }
            }
        },
        progress: true,
        headers: {

        },
        poll: false,
        inline: true,
        noInfo: true,
        baseURI: JSON.stringify('/')
    },
    build: {
        appName: '',
        index: path.resolve(__dirname, '../dist/index.html'),
        template: path.resolve(__dirname, '../public/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsPublic: '/',        // 'https://cdn.example.com/assets/[fullhash]/' CDN托管
        assetsSubDirectory: 'static',
        productionSourceMap: true,
        devtool: 'source-map',
        filename: utils.assetsPath('js/[name].[contenthash].bundle.js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
        baseURI: JSON.stringify('/')
    }
};

module.exports = config;
