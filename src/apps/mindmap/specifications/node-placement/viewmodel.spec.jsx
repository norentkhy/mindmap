import useResizeObserver from '@react-hook/resize-observer'
import {
  describe,
  test,
  expect,
  renderViewmodel,
  act,
} from '~mindmap/test-utilities/viewmodel'

describe('with explicit coordinates', () => {
  const [eventMouse, offsetMouse] = computeMouseEventAndOffset()

  const sizeNode = {
    width: 100,
    height: 20,
  }

  test('create root node', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNodeOnMouse(eventMouse))

    expect(vm.nodes[0].compute.containerStyle(sizeNode)).toEqual({
      position: 'absolute',
      left: `${offsetMouse.left - sizeNode.width / 2}px`,
      top: `${offsetMouse.top - sizeNode.height / 2}px`,
    })
  })
})

describe('without explicit coordinates', () => {
  const sizeNode = {
    width: 100,
    height: 20,
  }

  test('automatic placement without mouse event', () => {
    const vm = renderViewmodel()

    act(() => vm.do.createNode())
    expect(vm.nodes[0].compute.containerStyle(sizeNode)).toEqual({
      position: 'absolute',
      left: `${100 - sizeNode.width / 2}px`,
      top: `${50 - sizeNode.height / 2}px`,
    })

    act(() => vm.do.createNode())
    expect(vm.nodes[1].compute.containerStyle(sizeNode)).toEqual({
      position: 'absolute',
      left: `${100 - sizeNode.width / 2}px`,
      top: `${100 - sizeNode.height / 2}px`,
    })
  })

  test('child placement without mouse event', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())

    act(() => vm.nodes[0].do.createChild())
    expect(vm.nodes[1].compute.containerStyle(sizeNode)).toEqual({
      position: 'absolute',
      left: `${200 - sizeNode.width / 2}px`,
      top: `${50 - sizeNode.height / 2}px`,
    })

    act(() => vm.nodes[0].do.createChild())
    expect(vm.nodes[2].compute.containerStyle(sizeNode)).toEqual({
      position: 'absolute',
      left: `${200 - sizeNode.width / 2}px`,
      top: `${100 - sizeNode.height / 2}px`,
    })
  })
})

describe('dependencies', () => {
  test('useSizeObserver', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    expect(vm.nodes[0].use.sizeObserver).toBe(useResizeObserver)
  })
})

function computeMouseEventAndOffset() {
  const eventMouse = {
    clientX: 80,
    clientY: 110,
    target: {
      getBoundingClientRect: () => ({
        left: -60,
        top: -20,
        width: 300,
        height: 220,
      }),
    },
  }

  const offsetMouse = computeOffsetMouse(eventMouse)

  return [eventMouse, offsetMouse]
}

function computeOffsetMouse({ clientX, clientY, target }) {
  const { left, top } = target.getBoundingClientRect()
  return {
    left: clientX - left,
    top: clientY - top,
  }
}
