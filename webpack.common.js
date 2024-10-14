const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'ejs-plain-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader', // 開発環境では style-loader、本番環境では MiniCssExtractPlugin.loader を使用
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ejs/index.ejs',
      filename: 'index.html',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV === 'production'
        ? 'styles/[name].[contenthash].css'
        : 'styles/[name].css',
    }),
  ],
};
