import {
  view,
  createMockFn,
  describe,
  test,
  expect,
  addIdTo,
} from '~mindmap/test-utilities'
import React from 'react'
import { MainView, MindNode } from '~mindmap/components'

test('no links drawn when links not provided', () => {
  const nodeTexts = ['childlessA', 'childlessB', 'childlessC']
  const nodes = nodeTexts.map((text) => addIdTo({ text }))
  view.render(<MainView nodes={nodes} />)
  view.expect.childLink().not.toBeVisible()
})

test('node size registration (for anchor positioning)', () => {
  const size = { width: 1337, height: 420 }
  const sizedNode = addIdTo({
    do: { registerSize: createMockFn() },
    use: { sizeObserver: createMockUseSizeObserver(size) },
  })
  view.render(<MindNode node={sizedNode} />)

  expect(sizedNode.do.registerSize).nthCalledWith(1, size)
})

describe('single parent-child scenarios', () => {
  const parent = addIdTo({ text: 'parent' })
  const child = addIdTo({ text: 'child' })
  const linkStart = addIdTo({ linkedToNodeId: parent.id, centerOffset: {} })
  const linkEnd = addIdTo({ linkedToNodeId: child.id, centerOffset: {} })
  const childLink = addIdTo({ start: linkStart, end: linkEnd })

  test('links drawn between parent and child', () => {
    view.render(<MainView nodes={[parent, child]} links={[childLink]} />)
    view.expect.childLink().toBeVisible()
  })

  test('somehow enforce svg but not svg', () => {
    view.render(<MainView nodes={[parent, child]} links={[childLink]} />)
  })
})

function createMockUseSizeObserver(
  boundingClientRect = { width: 100, height: 20 },
  type = 'CALL_ONCE'
) {
  if (type === 'CALL_ONCE') {
    let firstSize = true
    return (_ref, callback) => {
      if (!firstSize) return
      firstSize = false
      const getBoundingClientRect = () => boundingClientRect
      callback({ target: { getBoundingClientRect } })
    }
  }
}
