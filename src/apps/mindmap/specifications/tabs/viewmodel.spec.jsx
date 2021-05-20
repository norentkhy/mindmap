import { renderHook, act } from '@testing-library/react-hooks'
import useViewmodel from '../../components/Model/useViewmodel'

function renderViewmodel() {
  const { result } = renderHook(useViewmodel)

  return new Proxy(result.current, {
    get: (_target, prop) => result.current[prop],
    set: () => {
      throw new Error('modify state using the viewmodel handlers')
    },
  })
}

function expectAnId() {
  return expect.any(String)
}

describe('tabs: viewmodel', () => {
  test('initial', () => {
    const vm = renderViewmodel()
    expect(vm.tabs).toEqual([
      {
        id: expectAnId(),
        selected: true,
        renaming: false,
        title: 'untitled',
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
        title: 'untitled',
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
      expect.objectContaining({ renaming: false, title: 'renamed tab' }),
    ])
  })
})
