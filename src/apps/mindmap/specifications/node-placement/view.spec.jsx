import {
  view,
  createMockFn,
  describe,
  test,
  expect,
  addIdTo,
} from '~mindmap/test-utilities'
import React from 'react'
import MindNode from '../../components/MainView/MindNode'
import { MainView } from '../../components/index'

describe('mindboard placement', () => {
  test('handles click event with coordinates', () => {
    const handleDoubleClick = createMockFn()
    view.render(<MainView createNode={handleDoubleClick} />)
    view.doubleClickOn.mindSpace()
    expect(handleDoubleClick).nthCalledWith(
      1,
      expect.objectContaining({
        clientX: expect.any(Number),
        clientY: expect.any(Number),
        target: expect.objectContaining({
          getBoundingClientRect: expect.any(Function),
        }),
      })
    )
  })

  test('placement via style', () => {
    let firstSize = true
    const stylishNode = addIdTo({
      text: 'a very stylish node',
      compute: {
        containerStyle: createMockFn((_boundingClientRect) => {
          return { position: 'absolute', left: '20px', top: '50px' }
        }),
      },
      use: {
        sizeObserver: createMockFn((_ref, callback) => {
          if (firstSize) {
            firstSize = false
            callback({
              target: {
                getBoundingClientRect: () => ({ width: 100, height: 20 }),
              },
            })
          }
        }),
      },
    })
    view.render(<MindNode node={stylishNode} />)
    expect(stylishNode.compute.containerStyle).toBeCalledWith({
      width: expect.any(Number),
      height: expect.any(Number),
    })
    view.expect
      .node(stylishNode)
      .toHaveStyle({ position: 'absolute', left: '20px', top: '50px' })
  })

  test('mindspace has relative position', () => {
    view.render(<MainView />)
    view.expect.mindSpace().toHaveStyle({ position: 'relative' })
  })
})
