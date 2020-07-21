const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')

const modeConfig = (env) => require(`./build-utils/webpack/webpack.${env}`)(env)
const presetConfig = require('./build-utils/webpack/loadPresets')

const parseJsonFile = require('./build-utils/parseJsonFile')
const convertPathsVsCode = require('./build-utils/webpack/convertPathsVsCode')

const configVsCode = parseJsonFile('./jsconfig.json')
const pathsVsCode = convertPathsVsCode(configVsCode, (pathWebpack) =>
  path.resolve(__dirname, pathWebpack)
)

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  const config = merge(
    {
      mode,
      entry: path.resolve(__dirname, 'src/apps/website/index.js'),
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { modules: false }]],
            },
          },
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader'],
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
          ...pathsVsCode,
        },
      },
      output: {
        filename: 'bundle.js',
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'src/apps/website/index.html'),
        }),
        new webpack.ProgressPlugin(),
      ],
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  )
  return config
}
