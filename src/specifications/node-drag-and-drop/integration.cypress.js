import {
  label,
  visitMindmapApp,
  calculateOffset,
  doubleClickElement,
  typeAndPressEnter,
  dragAndDropElement,
  expectFocusedAtElementNormalised,
} from 'src/test-utils/cypress'

export default function testNodePlacement(describe, beforeEach, it, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  it('drag and drop one', () => {
    cy.findByLabelText(label.mindSpace)
      .then(([MindSpace]) => {
        const startOffset = calculateOffset(MindSpace, 0.1, 0.2)
        const endOffset = calculateOffset(MindSpace, 0.8, 0.9)
        const toNext = { MindSpace, startOffset, endOffset }
        doubleClickElement(cy, MindSpace, startOffset).thenPassOn(toNext)
      })
      .then((fromPrev) => {
        const nodeText = 'this will be dragged'
        typeAndPressEnter(cy, nodeText).thenPassOn({ ...fromPrev, nodeText })
      })
      .then((fromPrev) => {
        const { startOffset, endOffset, nodeText } = fromPrev
        dragAndDropElement(cy, nodeText, startOffset, endOffset).thenPassOn(
          fromPrev
        )
      })
      .then((fromPrev) => {
        const { MindSpace, endOffset } = fromPrev
        const { left, top } = endOffset.normalised
        expectFocusedAtElementNormalised(cy, MindSpace, left, top)
      })
  })
}
