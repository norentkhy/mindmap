import { getAllCombinations } from '~/utils/FunctionalProgramming'

export default {
  getRectEdges,
  isRectOnEdge,
  areTouching,
  getCenterOffset,
  isInLeftQuadrant,
  isInTopQuadrant,
  isInRightQuadrant,
  isInBottomQuadrant,
}

function isRectOnEdge(rect, edge) {
  const points = getPointsOfRect(rect)
  const pointsOnLeftSideOfEdge = points.map((point) =>
    isPointOnLeftSideOfEdge(point, edge)
  )
  return containsBothTrueAndFalse(pointsOnLeftSideOfEdge)
}

function containsBothTrueAndFalse(arrayOfBooleans) {
  return arrayOfBooleans.some((x) => x) && arrayOfBooleans.some((x) => !x)
}

function isPointOnLeftSideOfEdge(point, edge) {
  // https://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line
  const [edgeStart, edgeEnd] = edge
  const edgeVector = spanVector(edgeStart, edgeEnd)
  const pointVector = spanVector(edgeStart, point)
  return edgeVector.x * pointVector.y - edgeVector.y * pointVector.x < 0
}

function spanVector(pointA, pointB) {
  return {
    x: pointB.left - pointA.left,
    y: pointB.top - pointA.top,
  }
}

function getRectEdges(rect) {
  const leftEdge = [
    { left: rect.left, top: rect.top },
    { left: rect.left, top: rect.top + rect.height },
  ]
  const rightEdge = [
    { left: rect.left + rect.width, top: rect.top },
    { left: rect.left + rect.width, top: rect.top + rect.height },
  ]
  const topEdge = [
    { left: rect.left, top: rect.top },
    { left: rect.left + rect.width, top: rect.top },
  ]
  const bottomEdge = [
    { left: rect.left, top: rect.top + rect.height },
    { left: rect.left + rect.width, top: rect.top + rect.height },
  ]
  return [leftEdge, rightEdge, topEdge, bottomEdge]
}

function areTouching(rectA, rectB) {
  const pointsA = getPointsOfRect(rectA)
  const pointsB = getPointsOfRect(rectB)
  return (
    pointsA.some((pointA) => isPointInRect(pointA, rectB)) ||
    pointsB.some((pointB) => isPointInRect(pointB, rectA))
  )
}

function getPointsOfRect(rect) {
  const horizontalSpan = [rect.left, rect.left + rect.width]
  const verticalSpan = [rect.top, rect.top + rect.height]
  const vectorPoints = getAllCombinations(horizontalSpan, verticalSpan)
  return vectorPoints.map(([left, top]) => ({ left, top }))
}

function isPointInRect(point, rect) {
  const pointIsRightOfLeftSide = point.left >= rect.left
  const pointIsLeftOfRightSide = point.left <= rect.left + rect.width
  const pointIsBelowTopSide = point.top >= rect.top
  const pointIsAboveBottomSide = point.top <= rect.top + rect.height

  return (
    pointIsRightOfLeftSide &&
    pointIsLeftOfRightSide &&
    pointIsBelowTopSide &&
    pointIsAboveBottomSide
  )
}

function getCenterOffset(Element) {
  const Rect = Element.getBoundingClientRect()
  return {
    left: Rect.left + Rect.width / 2,
    top: Rect.top + Rect.height / 2,
  }
}

function isInLeftQuadrant(angle) {
  return angle >= (3 / 4) * Math.PI || angle < -(3 / 4) * Math.PI
}

function isInTopQuadrant(angle) {
  return angle >= (1 / 4) * Math.PI && angle < (3 / 4) * Math.PI
}

function isInRightQuadrant(angle) {
  return angle >= (-1 / 4) * Math.PI && angle < (1 / 4) * Math.PI
}

function isInBottomQuadrant(angle) {
  return angle >= (-3 / 4) * Math.PI && angle < (-1 / 4) * Math.PI
}
