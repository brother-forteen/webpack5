/**
 * @createDate: 2021/3/8
 * @author: wen_dell
 * @email: wendell.chen@chinaentropy.com
 * **/
const merge = require('webpack-merge');
const base = require('./webpack.base.conf');
const config = require('./../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const utils = require('../build/utils');
const webpack = require('webpack');

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(base, {
    mode: 'production',

    devtool: config.build.productionSourceMap ? config.build.devtool : false,

    optimization: {
        minimizer : [

        ],
        splitChunks: {
            miniSize: {
                javascript: 30000,
                style: 50000
            }
        },
        moduleIds: 'deterministic',    // 有益于长期缓存，但对比于 hashed 来说，它会导致更小的文件 bundles

    },

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: utils.assetsPath('css/[name].css'),
            chunkFilename: utils.assetsPath('css/[id].css')
        }),

        new OptimizeCssAssetsWebpackPlugin(),

        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(),
    ]
});
