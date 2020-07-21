function separateFills(svgContents) {
  const hexRegExp = /(fill=)"#([0-9a-f]{6})"/g
  const hexMatches = [...svgContents.matchAll(hexRegExp)]

  const fills = hexMatches.map((match) => match[2])
  const replaceFillHexWithReference = initializeReferenceReplacer()
  const svgWithFillReferences = svgContents.replace(
    hexRegExp,
    replaceFillHexWithReference
  )

  return { fills, svgWithFillReferences }
}

function initializeReferenceReplacer() {
  let index = -1
  return (match, p1) => {
    index++
    return p1 + '{`#${fills[' + index + ']}`}'
  }
}

module.exports = { separateFills }
