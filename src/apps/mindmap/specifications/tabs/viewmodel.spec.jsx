import {
  describe,
  test,
  expect,
  expectAnId,
  renderViewmodel,
  act,
  expectEqualExcludingFunctions,
} from '~mindmap/test-utilities/viewmodel'

describe('tab buttons', () => {
  test('initial', () => {
    const vm = renderViewmodel()
    expect(vm.tabs).toEqual([
      {
        id: expectAnId(),
        selected: true,
        renaming: false,
        name: 'untitled',
        do: {
          rename: expect.any(Function),
          select: expect.any(Function),
          editName: expect.any(Function),
        },
      },
    ])
  })

  test('add a tab', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createTab())
    expect(vm.tabs).toEqual([
      expect.objectContaining({ selected: false }),
      {
        id: expectAnId(),
        selected: true,
        renaming: false,
        name: 'untitled',
        do: {
          rename: expect.any(Function),
          select: expect.any(Function),
          editName: expect.any(Function),
        },
      },
    ])
  })

  test('select a tab', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createTab())
    act(() => vm.tabs[0].do.select())
    expect(vm.tabs).toEqual([
      expect.objectContaining({ selected: true }),
      expect.objectContaining({ selected: false }),
    ])
  })

  test('start to rename a tab', () => {
    const vm = renderViewmodel()
    act(() => vm.tabs[0].do.editName())
    expect(vm.tabs).toEqual([expect.objectContaining({ renaming: true })])
  })

  test('rename a tab', () => {
    const vm = renderViewmodel()
    act(() => vm.tabs[0].do.editName())
    act(() => vm.tabs[0].do.rename('renamed tab'))
    expect(vm.tabs).toEqual([
      expect.objectContaining({ renaming: false, name: 'renamed tab' }),
    ])
  })
})

describe('nodes context control', () => {
  test('new nodes when tab is created', () => {
    const vm = renderViewmodel()
    const initialNodes = vm.nodes
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.changeNodeText('changed node text'))

    act(() => vm.do.createTab())

    expect(vm.nodes).toEqual(initialNodes)
  })

  test('nodes reconstructed when tab switched back', () => {
    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.changeNodeText('changed node text'))
    const nodesFirstTab = vm.nodes
    act(() => vm.do.createTab())

    act(() => vm.tabs[0].do.select())

    expectEqualExcludingFunctions(vm.nodes, nodesFirstTab)
  })

  test('not sure why this crashes', () => {

    const vm = renderViewmodel()
    act(() => vm.do.createNode())
    act(() => vm.nodes[0].do.changeNodeText('changed node text'))
    act(() => vm.do.createTab())

    act(() => vm.tabs[0].do.select())
    act(() => vm.tabs[1].do.select())
  })
})
