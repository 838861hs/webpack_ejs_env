const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// `common.js` を生成
function generateCommonJs() {
  const directories = ['./src/js/common', './src/js/components']
  const imports = directories.flatMap(dir => {
    return fs
      .readdirSync(dir)
      .filter(file => file.endsWith('.js'))
      .map(file => `import '${dir}/${file}';`)
  })

  const content = imports.join('\n')
  fs.writeFileSync('./src/js/common.js', content, 'utf8')
}

// `common.scss` を生成
function generateCommonScss() {
  const directories = [
    './src/scss/components',
    './src/scss/foundation',
    './src/scss/global',
    './src/scss/layout',
  ]
  const imports = directories.flatMap(dir => {
    return fs
      .readdirSync(dir)
      .filter(file => file.endsWith('.scss') && file !== 'common.scss')
      .map(file => `@use '${dir}/${file.replace('.scss', '')}';`)
  })

  const content = imports.join('\n')
  fs.writeFileSync('./src/scss/common.scss', content, 'utf8')
}

generateCommonJs()
generateCommonScss()

// `src/ejs` のエントリーポイントを取得
const ejsFiles = fs
  .readdirSync('./src/ejs')
  .filter(file => file.endsWith('.ejs'))

// JavaScriptエントリーポイント
const jsFiles = ejsFiles.reduce((entries, file) => {
  const name = file.replace('.ejs', '')
  entries[name] = `./src/js/${name}.js`
  return entries
}, {})

// SCSSエントリーポイント
const scssFiles = ejsFiles.reduce((entries, file) => {
  const name = file.replace('.ejs', '')
  entries[name] = `./src/scss/${name}.scss`
  return entries
}, {})

// エントリーポイントを統合
const entryPoints = {
  ...jsFiles,
  ...scssFiles,
  common: './src/js/common.js',
  commonStyles: './src/scss/common.scss',
}

module.exports = {
  entry: entryPoints,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // CSSを外部ファイルとして出力
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
      {
        test: /\.ejs$/,
        use: ['html-loader', 'ejs-plain-loader'],
      },
    ],
  },
  plugins: [
    ...ejsFiles.map(file => {
      const chunkName = file.replace('.ejs', '')
      return new HtmlWebpackPlugin({
        template: `./src/ejs/${file}`,
        filename: `${chunkName}.html`,
        chunks: ['common', 'commonStyles', chunkName], // common.js と common.scss を先に読み込む
        chunksSortMode: 'manual',
      })
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
  ],
  optimization: {
    minimize: false, // Minifyを無効化
  },
}
