const fs = require('fs')

function parseJsonFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

module.exports = parseJsonFile
