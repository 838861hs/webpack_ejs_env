const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // CSSの抽出プラグイン

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].js', // JSファイルをjsフォルダにハッシュなしで出力
    path: path.resolve(__dirname, 'dist'),
    clean: true, // 古いファイルを削除
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // CSSを分離して抽出
          'css-loader', // CSSをJavaScriptに変換
          'sass-loader', // SCSSをCSSに変換
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css', // CSSファイルをstylesフォルダに出力
    }),
  ],
  optimization: {
    minimize: false, // 圧縮を無効化
    runtimeChunk: false, // ランタイムコードを無効化
    moduleIds: 'named', // モジュールIDを名前に変更
    chunkIds: 'named', // チャンクIDを名前に変更
  },
})
