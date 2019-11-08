const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const path = require("path");
const {
    smart
} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 自动生成html，并引入打包后的js文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const glob = require('glob');
// 主要功能就是查找匹配的文件
// 主要作用是清除无意义的css，只能配合mini-css-extract-plugin 使用
const PurgeCssWebpackPlugin = require("purgecss-webpack-plugin");

// 分析代码，包括打包后的大小


module.exports = (env) => {
    // env是环境变量
    let isDev = env.development;
    const base = {
        entry: {
            "a": path.resolve(__dirname, '../src/a.js'),
            "b": path.resolve(__dirname, '../src/b.js')
        },
        module: {
            // loader写法[]/{}
            // 解析css时就不能渲染dom
            // css可以并行js 一同加载 mini-css-extract-plugin
            // babel-loader会调用@babel/core
            rules: [{
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader'
                },
                {
                    // 打包css还需要解决前缀的问题
                    test: /\.css$/,
                    use: [
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            // 如果css引用了sass文件 @import
                            loader: 'css-loader',
                            options: { //给loader传参数
                                importLoaders: 2
                            }

                        }, 'postcss-loader', 'sass-loader'
                    ]
                },
                {
                    // 匹配到sass文件，使用sass-loader,来调用node-sass处理sass文件；
                    test: /\.scss/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.(woff|ttf|eot|svg)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    use: [{
                            loader: 'url-loader',
                            // 如果大于100K的会使用url-loader;
                            options: {
                                name: 'image/[contentHash].[ext]',
                                limit: 1024
                            }
                        }, {
                            loader: 'file-loader'
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                optipng: {
                                    enabled: false,
                                },
                                pngquant: {
                                    quality: [0.65, 0.90],
                                    speed: 4
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                // the webp option will enable WEBP
                                webp: {
                                    quality: 75
                                }
                            }
                        }
                    ]
                }
            ]
        },
        output: {
            filename: '[name].js',//同步打包的名字
            chunkFilename:'[name].min.js',
            path: path.resolve(__dirname, '../dist')
        },
        externals: {
            'jquery': '$'
        },
        optimization: { //优化项
            usedExports: true //使用了哪个模块你说下
        },
        plugins: [
            new VueLoaderPlugin(),
            !isDev && new MiniCssExtractPlugin({
                filename: 'css/main.css'
                // 抽离出的css文件名
            }),
            // 净化css文件
            // new PurgeCssWebpackPlugin({
            //     paths: glob.sync("./src/**/*", {
            //         nodir: true,//不配目录，只匹配文件；
            //     })
            // }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'index.html', //默认
                minify: !isDev && {
                    removeAttributeQuotes: true,
                    // 去掉双引号
                    collapseWhitespace: true
                    // html折叠成一行
                },
                chunks:['a']
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: 'login.html', 
                chunksSortMode:'manual',//手动排序
                chunks:['b','a']
            }),

        ].filter(Boolean)
    }
    if (isDev) {
        return smart(base, dev)
    } else {
        return smart(base, prod);
    }
}