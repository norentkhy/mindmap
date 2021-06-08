import {
  describe,
  test,
  expect,
  expectAnId,
  renderViewmodel,
  act,
} from '~mindmap/test-utilities/viewmodel'

describe('nodes', () => {
  test('nodes to be rendered are available as an array', () => {
    const vm = renderViewmodel()
    expect(vm.nodes).toEqual([])
  })

  test('properties of node creation', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    expect(vm.nodes).toEqual([
      expect.objectContaining({
        id: expectAnId(),
        text: '',
        editing: true,
        focused: true,
        do: expect.objectContaining({
          startToEdit: expect.any(Function),
          changeNodeText: expect.any(Function),
          createChild: expect.any(Function),
        }),
      }),
    ])
  })

  test('give created node text', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.changeNodeText('changed node text'))
    expect(vm.nodes).toEqual([
      expect.objectContaining({
        text: 'changed node text',
        editing: false,
      }),
    ])
  })

  test('properties of child node creation', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.changeNodeText('parent node'))
    act(() => vm.nodes[0].do.createChild())
    expect(vm.nodes).toEqual([
      expect.any(Object),
      expect.objectContaining({
        id: expectAnId(),
        text: '',
        editing: true,
        focused: true,
        do: expect.objectContaining({
          startToEdit: expect.any(Function),
          changeNodeText: expect.any(Function),
          createChild: expect.any(Function),
        }),
      }),
    ])
  })

  test('change node text', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.changeNodeText('this will change'))
    act(() => vm.nodes[0].do.startToEdit())
    expect(vm.nodes).toEqual([
      expect.objectContaining({
        editing: true,
      }),
    ])
  })
})
