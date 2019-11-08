const path = require('path');
const DllPlugin = require('webpack').DllPlugin;

module.exports = {
    mode:'development',
    entry:[path.resolve(__dirname,'../src/cale.js')],
    output: {
        library: 'vue',//打包后接收自执行函数的名字
        // libraryTarget:"commonjs2",
        filename: 'vue.js',
        path:path.resolve(__dirname,'../dll')
    },
    plugins: [
        // 生成一个manifest文件
        new DllPlugin({
            name: "vue",
            path: path.resolve(__dirname, '../dll/manifest.json')
        })
    ]
}
