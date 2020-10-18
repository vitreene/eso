const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.config.js');

console.log('WEBPACK');
module.exports = merge(webpackBaseConfig, {
  devServer: {
    host: '0.0.0.0', //your ip address
    port: 3003,
    disableHostCheck: true,
    // stats: "minimal",
    // bonjour: true
  },
});
