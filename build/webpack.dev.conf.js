/**
 * @createDate: 2021/3/8
 * @author: wen_dell
 * @email: wendell.chen@chinaentropy.com
 * **/
'use strict';

const config = require('./../config/index.js');
const base = require('./webpack.base.conf');

const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(base, {
    mode: 'development',
    devtool: config.dev.devtool,
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {
                    from: '/.*/',
                    to: path.posix.join(config.dev.assetsPublic, 'index.html')
                }
            ]
        },
        hot: config.dev.devServer.hot,
        contentBase: config.dev.contentBase,
        compress: config.dev.devServer.compress,           // 启用gzip压缩
        host: config.dev.devServer.host,
        port: config.dev.devServer.port,
        open: config.dev.devServer.open,
        overlay: config.dev.devServer.overlay ? { warning: false, errors: true } : false,
        publicPath: config.dev.assetsPublic,
        proxy: config.dev.proxy,
        progress: config.dev.progress,
        quiet: true,                // necessary for FriendlyErrorsPlugin
        headers: config.dev.headers,
        watchOptions: {
            poll: config.dev.poll
        },
        inline: config.dev.inline,
        noInfo: config.dev.noInfo
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),       // webpack内置的热更新插件
    ]
});
