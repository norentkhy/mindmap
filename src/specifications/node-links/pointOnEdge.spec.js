import { Geometry } from 'src/data-structures/index'

test.each([
  [[-1, 1], { width: 120, height: 24 }, { left: 540, top: 330 }],
  [[-1, 0], { width: 20, height: 60 }, { left: 230, top: 333 }],
  [[-1, 0.001], { width: 20, height: 60 }, { left: 230, top: 333 }],
  [[1, 0.2], { width: 21, height: 23 }, { left: 333, top: 123 }],
])('calculate point on edge', ([dx, dy], boxSize, centerOffset) => {
  const angle = Math.atan2(dy, dx)

  const pointOnEdge = Geometry.computePointOnEdge(angle, boxSize, centerOffset)

  const angleToPointOnEdge = Math.atan2(
    pointOnEdge.top - centerOffset.top,
    pointOnEdge.left - centerOffset.left
  )

  expectAnglesToBeClose(angleToPointOnEdge, angle)
})

test.each([
  [[-1, 1], { width: 120, height: 24 }, { left: 540, top: 330 }],
  [[-1, 0], { width: 20, height: 60 }, { left: 230, top: 333 }],
  [[-1, 0.001], { width: 20, height: 60 }, { left: 230, top: 333 }],
  [[1, 0.2], { width: 21, height: 23 }, { left: 333, top: 123 }],
])('calculate opposite point on edge', ([dx, dy], boxSize, centerOffset) => {
  const angle = Math.atan2(dy, dx) + Math.PI

  const pointOnEdge = Geometry.computePointOnEdge(angle, boxSize, centerOffset)

  const angleToPointOnEdge = Math.atan2(
    pointOnEdge.top - centerOffset.top,
    pointOnEdge.left - centerOffset.left
  )

  expectAnglesToBeClose(angleToPointOnEdge, angle)
})

function expectAnglesToBeClose(a, b) {
  const angles = [a, b].map(Geometry.sanitizeAngle)
  const remainders = angles.map((x) => x % Math.PI)
  if (hasSameSign(remainders)) expect(remainders[0]).toBeCloseTo(remainder[1])

  const positiveAngles = remainders.map((x) => addUntilPositive(x, 2 * Math.PI))
  expect(positiveAngles[0]).toBeCloseTo(positiveAngles[1])
}

function hasSameSign(...xs) {
  return xs.every((x) => x >= 0) || xs.every((x) => x <= 0)
}

function addUntilPositive(x, dx) {
  if (x >= 0) return x
  return addUntilPositive(x + dx, dx)
}
