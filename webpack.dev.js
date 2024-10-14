const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',  // 開発時のソースマップを有効化
  devServer: {
    static: path.join(__dirname, 'dist'),
    hot: true,  // ホットリロードを有効化
    open: true, // 自動でブラウザを開く
    liveReload: true,  // ライブリロードを有効化
    watchFiles: {
      paths: ['src/**/*.ejs', 'src/**/*.js', 'src/**/*.scss'],
      options: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
});
