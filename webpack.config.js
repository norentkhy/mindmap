const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

const modeConfig = (env) => require(`./build-utils/webpack/webpack.${env}`)(env)
const presetConfig = require('./build-utils/webpack/loadPresets')

const parseJsonFile = require('./build-utils/parseJsonFile')
const convertPathsVsCode = require('./build-utils/webpack/convertPathsVsCode')

const configVsCode = parseJsonFile('./tsconfig.json')
const pathsVsCode = convertPathsVsCode(configVsCode, (pathWebpack) =>
  path.resolve(__dirname, pathWebpack)
)

const babelModuleRule = {
  test: /\.(t|j)sx?$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'babel-loader',
}

const typescriptModuleRule = {
  test: /\.(t|j)sx?$/,
  exclude: /(node_modules|bower_components)/,
  loader: 'ts-loader',
}

const sourcemapModuleRule = {
  enforce: 'pre',
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'source-map-loader',
}

const imagesModuleRule = {
  test: /\.(png|svg|jpg|gif)$/,
  use: ['file-loader'],
}

const cssModuleRule = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
}

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  const config = merge(
    {
      mode,
      entry: path.resolve(__dirname, 'src/main.js'),
      module: {
        rules: [
          babelModuleRule,
          typescriptModuleRule,
          sourcemapModuleRule,
          imagesModuleRule,
          cssModuleRule,
        ],
      },
      devtool: 'source-map',
      resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        alias: { ...pathsVsCode },
      },
      output: {
        filename: 'bundle.js',
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'src/index.html'),
        }),
        new webpack.ProgressPlugin(),
      ],
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  )
  return config
}
