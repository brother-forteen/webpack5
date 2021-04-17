/**
 * @createDate: 2021/3/8
 * @author: wen_dell
 * @email: wendell.chen@chinaentropy.com
 * **/
'use strict';

const path = require('path');
const config = require('../config/index.js');
const utils = require('./utils');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
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
    cache: {
        type: 'filesystem',
        cacheDirectory: 'node_modules/.cache/webpack',     // 默认将缓存存储在 node_modules/.cache/webpack
        // 缓存依赖，当缓存依赖修改时，缓存失效
        buildDependencies: {
            // 将配置添加依赖，更改配置时，使得缓存失效
            config: [__filename]
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            enforce: 'pre',                                 // 在加载前执行
                            fix: true,                                      // 自动修复
                            include: [path.resolve(__dirname, '../src')],   // 指定检查的目录
                            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                        }
                    }
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
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            outputPath: 'imgs/', //输出路径
                            name: utils.assetsPath('img/[name]-[hash:7].[ext]'), //文件名
                            limit: 8192, //超过限制会使用file-loader

                            // webpack5不会出现
                            // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs，解析市会出现问题：[object Module]
                            // 解决：关闭url-loader的es6模块化，使用commonjs解析
                            // esModule: false, //支持 require("imgUrl") 方式
                        }
                    }
                ]
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
            inject: 'body',
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

        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../public'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),

        new friendlyErrorsWebpackPlugin(),

        new ModuleFederationPlugin({
            name: config.build.appName,                 // 当前应用名称，需要全局唯一
            remotes: {                                  // 可以将其他项目的name映射到当前的项目中
                app_two: 'app_tow_remote',
                app_three: 'app_three_remote'
            },
            exposes: {                                  // 表示导出的模块，只有在此申明的模块才可以作为远程依赖被使用。
                AppContainer: "./src/App"
            },
            shared: ['react', 'react-dom', 'react-router-dom'],    // 是非常重要的参数，制定了这个参数，可以让远程加载的模块对应依赖改为使用本地项目的 React 或 ReactDOM。
        })
    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,

        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client

        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
};
