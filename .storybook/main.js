const path = require('path')
const parseJsonFile = require('../build-utils/parseJsonFile')
const convertPathsVsCode = require('../build-utils/storybook/convertPathsVsCode')

const configVsCode = parseJsonFile('./jsconfig.json')
const pathsVsCode = convertPathsVsCode(configVsCode, (pathWebpack) =>
  path.resolve(__dirname, pathWebpack)
)

const moduleRule = {
  babelLoader: {
    test: /\.(js|jsx)$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader',
    options: {
      presets: [['@babel/preset-env', { modules: false }]],
    },
  },
  fileLoader: {
    test: /\.(png|svg|jpg|gif)$/,
    use: ['file-loader'],
  },
  styleCssLoader: {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
}

const customPaths = {
  extensions: ['*', '.js', '.jsx'],
  alias: {
    ...pathsVsCode,
  },
}

module.exports = {
  stories: ['../src/**/*.stories.[tj]s'],
  webpackFinal: async (config) => {
    config.module.rules = [
      moduleRule.babelLoader,
      moduleRule.fileLoader,
      moduleRule.styleCssLoader,
    ]

    config.resolve.extensions.push(...customPaths.extensions)
    config.resolve.alias = { ...config.resolve.alias, ...customPaths.alias }

    return config
  },
}
