const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin');
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer')
// CleanWebpackPlugin是默认返回对象的一个属性,所以需要解构
// const Webpack = require("webpack");

module.exports = {
    mode: 'production',
    optimization: { //优化项,会覆盖默认配置
        minimizer: [
            // 压缩js
            new TerserPlugin({
                parallel: true,
                cache: false
            }),
            new OptimizeCSSAssetsPlugin({})
            // 用了这个js也需要手动压缩
        ],
        // usedExports:true//使用了哪个模块你说下
        splitChunks: {
            // 以下全部为默认配置
            // initial,只操作同步的，all，全部的，async 只打异步的,默认
            chunks: "initial", // 默认支持异步的代码分割 import()
            minSize: 30000, // 文件超过30k 我就会抽离他
            maxSize: 0,
            minChunks: 1, // 最少模块引用一次才抽离
            maxAsyncRequests: 5, // 最多5个请求
            maxInitialRequests: 3, // 最多首屏加载3个请求
            automaticNameDelimiter: "~", // xxx~a~b
            automaticNameMaxLength: 30, // 最长名字打大小
            name: true,
            cacheGroups: { // 缓存组
                vue: {
                    test: /[\\/]node_modules[\\/]vue/,
                    priority: -2
                },
                react: {
                    test: /[\\/]node_modules[\\/](react)|(react-dom)/,
                    priority: -2
                },
                // vendors: {
                //     test: /[\\/]node_modules[\\/]/,
                //     priority: -10
                // },
                commons: { // common~a~b
                    minChunks: 2,
                    minSize: 1, // 如果公共代码 多一个字节就抽离
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*']
            // 默认此配置，可以省略
        }),
        // new Webpack.optimize.ModuleConcatenationPlugin()默认
        new BundleAnalyzerPlugin()
    ]
}