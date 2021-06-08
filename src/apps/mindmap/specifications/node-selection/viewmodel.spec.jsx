import {
  describe,
  test,
  expect,
  renderViewmodel,
  act,
} from '~mindmap/test-utilities/viewmodel'
import { repeat } from '~/utils/FunctionalProgramming'

test('give created node text', () => {
  const vm = renderViewmodel()
  repeat(5, (i) => {
    act(() => vm.do.createNode())
    const [lastNode] = vm.nodes.slice(-1)
    act(() => lastNode.do.changeNodeText(`node ${i}`))
  })

  repeat(5, (i) => {
    act(() => vm.nodes[i].do.select())
    expect(vm.nodes[i].focused).toBe(true)
  })
})
