const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',  // 本番モード
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],  // JavaScriptの圧縮
  },
  output: {
    filename: 'bundle.[contenthash].js',  // キャッシュバスティング用にハッシュを追加
    path: path.resolve(__dirname, 'dist'),
  },
});
