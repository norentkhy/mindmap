import { repeat } from '~/utils/FunctionalProgramming'
import {
  describe,
  test,
  expect,
  renderViewmodel,
  act,
  expectAnId,
} from '~mindmap/test-utilities/viewmodel'

test('standard viewmodel has empty links', () => {
  const vm = renderViewmodel()
  expect(vm.links).toEqual([])
})

test('child node creation: creates link', () => {
  const vm = renderViewmodel()
  act(() => vm.do.createNode())
  act(() => vm.nodes[0].do.createChild())

  const [parent, child] = vm.nodes
  expect(vm.links).toEqual([
    expect.objectContaining({
      id: expectAnId(),
      start: expect.objectContaining({
        id: expectAnId(),
        linkedToNodeId: parent.id,
        centerOffset: parent.centerOffset,
      }),
      end: expect.objectContaining({
        id: expectAnId(),
        linkedToNodeId: child.id,
        centerOffset: child.centerOffset,
      }),
    }),
  ])
})

describe('anchor positioning: automatic child spawn', () => {
  test('assumption: first child spawns right or parent', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.createChild())

    const [parentOffset, childOffset] = vm.nodes.map(
      (node) => node.centerOffset
    )
    expect(parentOffset.left < childOffset.left).toBe(true)
    expect(parentOffset.top === childOffset.top).toBe(true)
  })

  test('anchors on edge: via size registration', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())

    const nodeSize = { width: 100, height: 20 }
    act(() => vm.nodes[0].do.registerSize(nodeSize))
    act(() => vm.nodes[0].do.createChild())

    const [link] = vm.links
    const parentOffset = vm.nodes[0].centerOffset
    expect(link.start.centerOffset).toEqual({
      left: parentOffset.left + nodeSize.width / 2,
      top: parentOffset.top,
    })
  })

  test('anchors on edge: via size registration', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())

    const nodeSize = { width: 100, height: 20 }
    act(() => vm.nodes[0].do.createChild())
    act(() => vm.nodes[1].do.registerSize(nodeSize))

    const [link] = vm.links
    const childOffset = vm.nodes[1].centerOffset
    expect(link.end.centerOffset).toEqual({
      left: childOffset.left - nodeSize.width / 2,
      top: childOffset.top,
    })
  })

  test('connect two nodes', () => {
    const vm = renderViewmodel()
    repeat(2, () => act(() => vm.do.createNode()))

    const [from, to] = vm.nodes
    act(() => from.do.makeParent(to.id))
    expect(vm.links).toEqual([expect.objectContaining({})])
  })

  test('anchors on edge: via size registration', () => {
    const vm = renderViewmodel()
    const nodeSize = { width: 100, height: 20 }

    const parentMouseEvent = computeMouseEvent({ left: 300, top: 200 })
    act(() => vm.do.createNodeOnMouse(parentMouseEvent))

    const childMouseEvent = computeMouseEvent({ left: 300, top: 100 })
    act(() => vm.do.createNodeOnMouse(childMouseEvent))

    vm.nodes.forEach((node) => act(() => node.do.registerSize(nodeSize)))

    const [parent, child] = vm.nodes
    act(() => parent.do.makeParent(child.id))

    const [link] = vm.links
    const [parentOffset, childOffset] = vm.nodes.map(
      (node) => node.centerOffset
    )
    expect(link.start.centerOffset).toEqual({
      left: parentOffset.left,
      top: parentOffset.top - nodeSize.height / 2,
    })
    expect(link.end.centerOffset).toEqual({
      left: childOffset.left,
      top: childOffset.top + nodeSize.height / 2,
    })
  })

  test('size registration cannot be timeline stepped', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())

    const nodeSize = { width: 100, height: 20 }
    act(() => vm.nodes[0].do.registerSize(nodeSize))
    act(() => vm.do.undo())
    expect(vm.nodes).toEqual([])
  })
})

function computeMouseEvent(offsetMouse) {
  const clientOffset = { clientX: offsetMouse.left, clientY: offsetMouse.top }
  const boundingClientRect = { left: 0, top: 0, width: 3840, height: 2160 }
  return {
    ...clientOffset,
    target: { getBoundingClientRect: () => boundingClientRect },
  }
}
