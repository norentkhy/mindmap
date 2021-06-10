import {
  describe,
  test,
  expect,
  renderViewmodel,
  act,
} from '~mindmap/test-utilities/viewmodel'

test('handleDragStart', () => {
  const sizeNode = { width: 100, height: 20 }
  const vm = renderViewmodel()
  const offset = computeMouseEvent({ left: 300, top: 200 })
  act(() => vm.do.createNodeOnMouse(offset))

  const offsetStart = computeMouseEvent({ left: 310, top: 205 })
  const offsetEnd = computeMouseEvent({ left: 910, top: 705 })
  act(() => vm.nodes[0].do.handleDragStart(offsetStart))
  act(() => vm.nodes[0].do.handleDragEnd(offsetEnd))
  expect(vm.nodes[0].compute.containerStyle(sizeNode)).toEqual({
    position: 'absolute',
    left: `${900 - sizeNode.width / 2}px`,
    top: `${700 - sizeNode.height / 2}px`,
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
