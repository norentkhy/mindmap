import {
  describe,
  test,
  expect,
  renderViewmodel,
  act,
} from 'src/test-utils/viewmodel'

describe('node-folding: viewmodel', () => {
  test('toggle fold: fold and unfold', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.changeNodeText('fold this'))
    act(() => vm.nodes[0].do.createChild())
    act(() => vm.nodes[1].do.changeNodeText('child'))

    expect(vm.nodes[0]).toMatchObject({ text: 'fold this', folded: false })
    expect(vm.nodes.length).toBe(2)

    act(() => vm.nodes[0].do.toggleFold())
    expect(vm.nodes[0]).toMatchObject({
      text: 'fold this',
      folded: true,
      focused: true,
    })
    expect(vm.nodes.length).toBe(1)

    act(() => vm.nodes[0].do.toggleFold())
    expect(vm.nodes[0]).toMatchObject({ text: 'fold this', folded: false, focused: true })
    expect(vm.nodes.length).toBe(2)
  })
})
