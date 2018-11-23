const path = require('path');
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const isProduction = process.env.NODE_ENV === 'production'

function addStyleResource(rule) {
    rule
        .use('style-resources-loader')
        .loader('style-resources-loader')
        .options({
            patterns: [path.resolve(__dirname, './src/styles/**/*.less')],
        });
}

module.exports = {
    devServer: {
        port: 3001
    },
    productionSourceMap: false, // 生产不生成 sourcemap
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    // gzip 压缩
    // configureWebpack: config => {
    //     if (isProduction) {
    //         config.plugins.push(new CompressionWebpackPlugin({
    //             algorithm: 'gzip',
    //             test: new RegExp('\\.js$'),
    //             threshold: 160,
    //             minRatio: 0.8
    //         }))
    //     }
    // }
};