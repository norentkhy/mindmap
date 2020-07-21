const { describe, test, expect } = require('@jest/globals')
const { separateFills } = require('./SvgManipulator')

describe('extract svg props', () => {
  const fills = ['7c5a7f', '82638c']
  const sampleString = `<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="700"><path d="M0 0c0 5 2 9 8 8v5c3 1 5 3 5 6h4l2-4 1 4 4 5 16-5h18l1 4-3 1v3l13 2c5-1 9-3 14-3-6-3-13-5-20-6v-4c-6 0-11 3-15-4h5c-2-2-3-3-3-6l3 2V0H0z" fill="#${fills[0]}"/><path d="M53 0v8l-3-2c-1 3 0 4 3 5l-5 1c3 8 9 5 15 4v4c7 2 19 3 23 10l9-1-7-1 2-4-8-1 1-3c-4-1-7-2-11-1l5-2 1-4-6-6 2-4 9 2 2-5H53z" fill="#${fills[1]}"/>
`

  test('extract fills from svg string', () => {
    const { fills: foundFills } = separateFills(sampleString)

    expect(foundFills).toContain(fills[0])
    expect(foundFills).toContain(fills[1])
    expect(foundFills).not.toContain('thisisnotahex')
  })

  test('replaces fill-hex with fill-reference', () => {
    const { svgWithFillReferences } = separateFills(sampleString)

    expect(svgWithFillReferences).toContain('fill={`#${fills[0]}`}')
    expect(svgWithFillReferences).toContain('fill={`#${fills[1]}`}')
    expect(svgWithFillReferences).not.toContain('fill={`#${fills[2]}`}')
  })
})
