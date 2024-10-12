const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',  // ソースマップを有効化
  devServer: {
    static: path.join(__dirname, 'dist'),
    hot: true,  // ホットリロードを有効化
    open: true,  // サーバー起動時に自動的にブラウザを開く
    liveReload: true,
    watchFiles: {
      paths: ['src/**/*.ejs', 'src/**/*.js', 'src/**/*.scss'],  // 監視対象ファイル
      options: {
        usePolling: true,  // ポーリング方式を有効にしてファイル変更を確実に検知
      },
    },
  },
});
