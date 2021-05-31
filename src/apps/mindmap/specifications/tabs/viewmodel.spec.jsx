import {
  describe,
  test,
  expect,
  expectAnId,
  renderViewmodel,
  act,
} from '~mindmap/test-utilities/viewmodel'

describe('tabs: viewmodel', () => {
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
