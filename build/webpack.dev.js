const path = require("path");
const DllReferencePlugin = require('webpack').DllReferencePlugin;
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
    mode: 'development',
    plugins: [
        // 当前的dl.js没有在页面中引用；
        // 打包时先查找manifest中的name
        new DllReferencePlugin({
            manifest: path.resolve(__dirname, "../dll/manifest.json")
        }),
        // 在页面中引入dll/vue.js
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../dll/vue.js')
        })
    ],
    devServer: {
        port: 3001,
        // gzip可以提升返回页面的速度
        compress: true,
        contentBase: path.resolve(__dirname, '../dist')
        // webpack启动服务下会在dist目录下

    }
}