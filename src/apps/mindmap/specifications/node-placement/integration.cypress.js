import {
  doubleClickToCreateNode,
  expectToFindNodeAt,
  expectToFocusedAt,
  generateUniqueString,
  pressOnKeyboard,
  typeOnKeyboard,
  visitMindmapApp,
} from '~mindmap/test-utilities/cypress'
import { span, getAllCombinations } from '~/utils/FunctionalProgramming'

export default function testNodePlacement(describe, beforeEach, it, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  describe('node creation under mouse double click', () => {
    it('single instance', () => {
      const doubleClickOffsetReference = 'doubleClickedOffsetReference'
      doubleClickToCreateNode(cy, 0.9, 0.9, doubleClickOffsetReference)
      expectToFindNodeAt(cy, doubleClickOffsetReference)
    })

    it('multiple node placements', () => {
      createRatioGrid({
        start: { left: 0.15, top: 0.15 },
        step: { horizontal: 0.3, vertical: 0.1 },
      }).forEach(([leftRatio, topRatio]) => {
        const clickReference = generateUniqueString()
        doubleClickToCreateNode(cy, leftRatio, topRatio, clickReference)
        typeOnKeyboard(cy, clickReference)
        pressOnKeyboard(cy, 'enter')

        expectToFocusedAt(cy, clickReference)
      })
    })
  })
}

function createRatioGrid({
  start: { left: leftRatio, top: topRatio },
  step: { horizontal, vertical },
}) {
  const leftRatios = span(leftRatio, horizontal, 1)
  const topRatios = span(topRatio, vertical, 1)
  return getAllCombinations(leftRatios, topRatios)
}
