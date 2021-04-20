/**
 * @createDate: 2021/3/8
 * @author: wen_dell
 * @email: wendell.chen@chinaentropy.com
 * **/
'use strict';

const config = require('../config/index.js');
const utils = require('./utils');

const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // context: __dirname,
    entry: {
        main: path.resolve(__dirname, '../src/main.js')
    },
    output: {
        filename: process.env.NODE_ENV === 'production' ? config.build.filename : config.dev.filename,
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublic : config.dev.assetsPublic,
        chunkFilename: process.env.NODE_ENV === 'production' ? config.build.chunkFilename : config.dev.chunkFilename
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
        alias: {
            '@': path.resolve('src')
        }
    },
    // cache: {
    //     type: 'filesystem',
    //     cacheDirectory: 'node_modules/.cache/webpack',     // 默认将缓存存储在 node_modules/.cache/webpack
    //     // 缓存依赖，当缓存依赖修改时，缓存失效
    //     buildDependencies: {
    //         // 将配置添加依赖，更改配置时，使得缓存失效 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
    //         config: [__filename]
    //     },
    //     name: 'development-cache'
    // },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    // {
                    //     loader: 'eslint-loader',
                    //     options: {
                    //         enforce: 'pre',                                 // 在加载前执行
                    //         fix: true,                                      // 自动修复
                    //         include: [path.resolve(__dirname, '../src')],   // 指定检查的目录
                    //         formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                    //     }
                    // }
                ]
            },
            {
                test: '/\.css$/',
                exclude: /\.module\.css$/, //排除css模块
                use: process.env.NODE_ENV === 'production' ?
                    [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]:
                    [
                        MiniCssExtractPlugin.loader,
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                        'postcss-loader',

                        // {
                        //     loader: 'postcss-loader',
                        //     options: {
                        //         ident: 'postcss',
                        //         plugins: () => {
                        //             require('postcss-preset-env')()
                        //         }
                        //     }
                        // }
                    ]
            },
            {
                test: /\.module\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: {
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        },
                    }
                }]
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp|woff|woff2|eot|ttf|otf)$/i,
                type: "assets/resource"
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 8192,
                            esModule: false,
                            name: utils.assetsPath('media/[name]-[hash:7].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),               // 自定义编译过程中的进度报告

        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            title: 'Title',
            index: config.build.index,
            template: config.build.template,
            // minify: {
            //     minifyJS: true,  //压缩内联js
            //     minifyCSS: true, //压缩内联css
            //     removeComments: true,        //移除HTML中的注释
            //     removeCommentsFromCDATA: true, //从脚本和样式删除的注释
            //     removeRedundantAttributes: true, //删除多余的属性
            //     collapseWhitespace: true, // 删除空白符与换行符
            //     removeAttributeQuotes: true
            // },
            // chunksSortMode: 'dependency'
        }),

        new webpack.DefinePlugin({
            BASE_URI: process.env.NODE_ENV === 'production' ? config.build.baseURI : config.dev.baseURI
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: config.dev.assetsSubDirectory,
                    globOptions: {
                        ignore: ['.*']
                    }
                }
            ]
        }),

        new friendlyErrorsWebpackPlugin(),

        // new ModuleFederationPlugin({
        //     name: config.build.appName,                 // 当前应用名称，需要全局唯一
        //     remotes: {                                  // 可以将其他项目的name映射到当前的项目中
        //         app_two: 'app_tow_remote',
        //         app_three: 'app_three_remote'
        //     },
        //     exposes: {                                  // 表示导出的模块，只有在此申明的模块才可以作为远程依赖被使用。
        //         AppContainer: "./src/App"
        //     },
        //     shared: ['react', 'react-dom', 'react-router-dom'],    // 是非常重要的参数，制定了这个参数，可以让远程加载的模块对应依赖改为使用本地项目的 React 或 ReactDOM。
        // })
    ],
    node: {
        // Polyfills and mocks to run Node.js-
        // environment code in non-Node environments.
        global: true, // boolean
        // replace "global" with the output.globalObject
        __filename: "mock", // boolean | "mock" | "eval-only"
        __dirname: "mock", // boolean | "mock" | "eval-only"
        // true: includes the real path
        // "mock": includes a fake path
        // "eval-only": only defines it at compile-time
        // false: disables all handling
    }
};
