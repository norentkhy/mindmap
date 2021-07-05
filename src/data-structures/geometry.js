import { getAllCombinations } from 'src/utils/FunctionalProgramming'

export default {
  computePointOnEdge,
  getRectEdges,
  isRectOnEdge,
  areTouching,
  getCenterOffset,
  sanitizeAngle,
  invertAngle,
}

function computePointOnEdge(angle, boxSize, centerOffset) {
  const pointVector = computePointVector(angle, boxSize)

  return {
    left: centerOffset.left + pointVector.dx,
    top: centerOffset.top + pointVector.dy,
  }
}

function computePointVector(angle, boxSize) {
  const sanitizedAngle = sanitizeAngle(angle)
  const half = { width: boxSize.width / 2, height: boxSize.height / 2 }
  if (sanitizedAngle === Math.PI / 2) return { dx: 0, dy: half.height }
  if (sanitizedAngle === -Math.PI / 2) return { dx: 0, dy: -half.height }
  if (sanitizedAngle === 0) return { dx: half.width, dy: 0 }
  if (sanitizedAngle === Math.PI) return { dx: -half.width, dy: 0 }

  const boxAngle = Math.atan2(half.height, half.width)

  if (isInTopOrBottomPart(sanitizedAngle, boxAngle))
    return vectorFrom({ angle: sanitizedAngle, dyAbs: half.height })

  if (isInLeftOrRightPart(sanitizedAngle, boxAngle))
    return vectorFrom({ angle: sanitizedAngle, dxAbs: half.width })
}

function isInTopOrBottomPart(angle, boxAngle) {
  return [isInTopPart, isInBottomPart].some((predicate) =>
    predicate(angle, boxAngle)
  )
}

function isInLeftOrRightPart(angle, boxAngle) {
  return [isInLeftPart, isInRightPart].some((predicate) =>
    predicate(angle, boxAngle)
  )
}

function sanitizeAngle(angle) {
  if (angle <= Math.PI && angle > -Math.PI) return angle
  if (angle > Math.PI) return sanitizeAngle(angle - 2 * Math.PI)
  if (angle <= -Math.PI) return sanitizeAngle(angle + 2 * Math.PI)
}

function vectorFrom({ dxAbs, dyAbs, angle }) {
  const tangent = Math.tan(angle)

  const xSign = Math.sign(Math.cos(angle))
  const ySign = Math.sign(Math.sin(angle))

  if (!dxAbs)
    return { dx: xSign * Math.abs(dyAbs / tangent), dy: ySign * dyAbs }
  if (!dyAbs)
    return { dx: xSign * dxAbs, dy: ySign * Math.abs(dxAbs * tangent) }
}

function isInLeftPart(angle, separationAngleInTopRightQuadrant) {
  const startAngle = Math.PI - separationAngleInTopRightQuadrant
  const endAngle = -startAngle
  return angle >= startAngle || angle < -endAngle
}

function isInTopPart(angle, separationAngleInTopRightPart) {
  const startAngle = separationAngleInTopRightPart
  const endAngle = Math.PI - startAngle
  return angle >= startAngle && angle < endAngle
}

function isInRightPart(angle, separationAngleInTopRightPart) {
  const startAngle = -separationAngleInTopRightPart
  const endAngle = -startAngle
  return angle >= startAngle && angle < endAngle
}

function isInBottomPart(angle, separationAngleInTopRightPart) {
  const endAngle = -separationAngleInTopRightPart
  const startAngle = -endAngle - Math.PI
  return angle >= startAngle && angle < endAngle
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

function invertAngle(angle) {
  return angle + Math.PI
}
