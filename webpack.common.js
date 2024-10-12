const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',  // エントリーポイント
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,  // ビルド先をクリーンアップ
    publicPath: '/',  // 正しいパスを設定
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,  // EJSファイルを処理
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'ejs-plain-loader',  // ejs-plain-loaderを使用
            options: {
              esModule: false,  // CommonJS形式で扱う
            },
          },
        ],
      },
      {
        test: /\.scss$/,  // SCSSファイルを処理
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,  // JSファイルを処理
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ejs/index.ejs',  // EJSテンプレート
      filename: 'index.html',  // 出力されるHTMLファイル名
      inject: true,  // 自動挿入を無効化
      minify: false,  // 最適化を無効にする
    }),
  ],
};
