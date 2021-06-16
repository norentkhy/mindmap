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

  test('create root node', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNodeOnMouse(eventMouse))
    expect(vm.nodes[0].centerOffset).toEqual(offsetMouse)
  })
})

describe('without explicit coordinates', () => {
  test('automatic placement without mouse event', () => {
    const vm = renderViewmodel()

    act(() => vm.do.createNode())
    expect(vm.nodes[0].centerOffset).toEqual({ left: 100, top: 50 })

    act(() => vm.do.createNode())
    expect(vm.nodes[1].centerOffset).toEqual({ left: 100, top: 100 })
  })

  test('child placement without mouse event', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())

    act(() => vm.nodes[0].do.createChild())
    expect(vm.nodes[1].centerOffset).toEqual({ left: 200, top: 50 })

    act(() => vm.nodes[0].do.createChild())
    expect(vm.nodes[2].centerOffset).toEqual({ left: 200, top: 100 })
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
