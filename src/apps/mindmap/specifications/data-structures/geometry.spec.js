import { describe, test, expect } from '@jest/globals'
import { Geometry } from '~mindmap/data-structures'

describe('isRectOnEdge', () => {
  test('rect on edge', () => {
    const rectOnEdge = { left: 0, top: 0, width: 10, height: 10 }
    const edge = [
      { left: 5, top: -10 },
      { left: 5, top: 20 },
    ]
    expect(Geometry.isRectOnEdge(rectOnEdge, edge)).toBe(true)
  })

  test('rect off edge', () => {
    const rectOffEdge = { left: 0, top: 0, width: 10, height: 10 }
    const edge = [
      { left: 20, top: -10 },
      { left: 20, top: 20 },
    ]
    expect(Geometry.isRectOnEdge(rectOffEdge, edge)).toBe(false)
  })
})

test('rectangles are touching', () => {
  const nodeRect = {
    height: 21,
    left: 85.890625,
    top: 131.09375,
    width: 53.796875,
  }
  const anchorRect = {
    height: 10,
    left: 134.6953125,
    top: 136.59375,
    width: 10,
  }
  expect(Geometry.areTouching(nodeRect, anchorRect)).toBe(true)
  expect(Geometry.areTouching(anchorRect, nodeRect)).toBe(true)
})
