import { Geometry } from 'src/data-structures'

export default {
  getBoundingClientRects,
  pairTouchingRects,
}

function getBoundingClientRects(Elements) {
  return Elements.map((Element) => Element.getBoundingClientRect())
}

function pairTouchingRects(rectsA, rectsB) {
  const unpairedRectsB = rectsB.slice()
  return rectsA.map((rectA) => [
    rectA,
    spliceTouchingRect(unpairedRectsB, rectA),
  ])
}

function spliceTouchingRect(candidateRects, targetRect) {
  const touchingIndex = candidateRects.findIndex((rect) =>
    Geometry.areTouching(rect, targetRect)
  )
  return candidateRects.splice(touchingIndex, 1)[0]
}
