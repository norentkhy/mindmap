import {
  test,
  expect,
  renderViewmodel,
  act,
} from 'src/test-utils/viewmodel'

test('handleDragStart', () => {
  const vm = renderViewmodel()
  const offset = computeMouseEvent({ left: 300, top: 200 }, ParentElement)
  act(() => vm.do.createNodeOnMouse(offset))

  const offsetStart = computeMouseEvent({ left: 310, top: 205 }, NodeElement)
  const offsetEnd = computeMouseEvent({ left: 910, top: 705 }, ParentElement)
  act(() => vm.nodes[0].do.handleDragStart(offsetStart, ParentElement))
  act(() => vm.do.handleNodeDrop(offsetEnd))
  expect(vm.nodes[0].centerOffset).toEqual({ left: 900, top: 700 })
})

const ParentElement = {
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 3840, height: 2160 }),
}

const NodeElement = {
  getBoundingClientRect: () => ({ left: 20, top: 40, width: 150, height: 25 }),
}

function computeMouseEvent(offsetMouse, TargetElement) {
  return {
    clientX: offsetMouse.left,
    clientY: offsetMouse.top,
    target: TargetElement,
  }
}
