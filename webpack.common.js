const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ejsFiles = fs.readdirSync('./src/ejs').filter(file => file.endsWith('.ejs'));

// src/jsディレクトリ内のすべてのJavaScriptファイルをエントリーポイントとして取得
const jsFiles = fs.readdirSync('./src/js').reduce((entries, file) => {
  if (file.endsWith('.js')) {
    const name = file.replace('.js', '');
    entries[name] = `./src/js/${file}`;
  }
  return entries;
}, {});



module.exports = {
  entry: jsFiles,
  output: {
    filename: 'js/[name].js',
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
            : 'style-loader',
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
    ...ejsFiles.map(file => {
      const chunkName = file.replace('.ejs', '');
      return new HtmlWebpackPlugin({
        template: `./src/ejs/${file}`,
        filename: file.replace('.ejs', '.html'),
        chunks: [chunkName], // 対応するJSファイルのみを含む
      });
    }),
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV === 'production'
        ? 'styles/[name].[contenthash].css'
        : 'styles/[name].css',
    }),
  ],
};
