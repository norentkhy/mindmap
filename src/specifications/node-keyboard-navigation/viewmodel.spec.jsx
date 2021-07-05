import {
  describe,
  test,
  expect,
  renderViewmodel,
  act,
} from 'src/test-utils/viewmodel'

describe('in a grid', () => {
  test.each(['left', 'right', 'up', 'down'])(
    'single node: same node focused',
    (direction) => {
      const vm = renderViewmodel()
      act(() => vm.do.createNode())
      act(() => vm.do.navigate(direction))
      expect(vm.nodes[0].focused).toBe(true)
    }
  )

  describe('two nodes', () => {
    test('horizontal: from left to right', () => {
      const nodes = [
        { text: 'left', left: 50, top: 100, focused: true },
        { text: 'right', left: 150, top: 100 },
      ]
      const vm = renderViewmodel()
      createNodes(vm, nodes)

      act(() => vm.do.navigate('right'))
      expectNodeToExist(vm, { text: 'right', focused: true })
    })

    test('horizontal: from right to left', () => {
      const nodes = [
        { text: 'left', left: 50, top: 100 },
        { text: 'right', left: 150, top: 100, focused: true },
      ]
      const vm = renderViewmodel()
      createNodes(vm, nodes)

      act(() => vm.do.navigate('left'))
      expectNodeToExist(vm, { text: 'left', focused: true })
    })

    test('vertical: from up to down', () => {
      const nodes = [
        { text: 'up', left: 100, top: 50, focused: true },
        { text: 'down', left: 100, top: 150 },
      ]
      const vm = renderViewmodel()
      createNodes(vm, nodes)

      act(() => vm.do.navigate('down'))
      expectNodeToExist(vm, { text: 'down', focused: true })
    })

    test('vertical: from down to up', () => {
      const nodes = [
        { text: 'up', left: 100, top: 50 },
        { text: 'down', left: 100, top: 150, focused: true },
      ]
      const vm = renderViewmodel()
      createNodes(vm, nodes)

      act(() => vm.do.navigate('up'))
      expectNodeToExist(vm, { text: 'up', focused: true })
    })
  })

  describe('four nodes', () => {
    test('one left, three stacked: from left to right', () => {
      const nodes = [
        { text: 'left', left: 100, top: 100, focused: true },
        { text: 'right-up', left: 150, top: 150 },
        { text: 'right-middle', left: 150, top: 100 },
        { text: 'right-down', left: 150, top: 200 },
      ]
      const vm = renderViewmodel()
      createNodes(vm, nodes)

      act(() => vm.do.navigate('right'))
      expectNodeToExist(vm, { text: 'right-middle', focused: true })
    })
  })
})

function createNodes(vm, nodes) {
  const nodeToFocus = nodes.find((node) => node.focused)
  const remainingNodes = nodes.filter((node) => !node.focused)
  const orderedNodes = [...remainingNodes, nodeToFocus]

  orderedNodes.forEach((node) => {
    const clickOffset = computeMouseEvent(node)
    act(() => vm.do.createNodeOnMouse(clickOffset))
    const [lastNode] = vm.nodes.slice(-1)
    act(() => lastNode.do.changeNodeText(node.text))
  })
}

function expectNodeToExist(vm, { text, focused }) {
  const nodeVmWithProperties = expect.objectContaining({ text, focused })
  const nodes = vm.nodes.map(({ text, focused }) => ({ text, focused }))
  return expect(nodes).toContainEqual(nodeVmWithProperties)
}

function computeMouseEvent(offsetMouse) {
  const clientOffset = { clientX: offsetMouse.left, clientY: offsetMouse.top }
  const boundingClientRect = { left: 0, top: 0, width: 3840, height: 2160 }
  return {
    ...clientOffset,
    target: { getBoundingClientRect: () => boundingClientRect },
  }
}
