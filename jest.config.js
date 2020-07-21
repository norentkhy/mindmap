const parseJsonFile = require('./build-utils/parseJsonFile')
const convertPathsVsCode = require('./build-utils/jest/convertPathsVsCode')

const configVsCode = parseJsonFile('./jsconfig.json')
const pathsVsCode = convertPathsVsCode(configVsCode)

const configAssets = {
 [ '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$']:
    '<rootDir>/src/utils/files-stub-jest.js',
}

module.exports = {
  setupFilesAfterEnv: ['jest-extended', './build-utils/jest/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
  moduleNameMapper: {
    ...pathsVsCode,
    ...configAssets,
  },
}
