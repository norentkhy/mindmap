import { describe, test, expect } from '@jest/globals'
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

describe('nodes', () => {
  test('nodes to be rendered are available as an array', () => {
    const vm = renderViewmodel()
    expect(vm.nodes).toEqual([])
  })

  test('properties of node creation', () => {
    const vm = renderViewmodel()
    act(() => vm.createRootNode())
    expect(vm.nodes).toEqual([
      expect.objectContaining({
        id: expectAnId(),
        text: '',
        editing: true,
        focused: true,
        do: {
          startToEdit: expect.any(Function),
          changeNodeText: expect.any(Function),
          toggleFold: expect.any(Function),
          createChild: expect.any(Function),
        },
      }),
    ])
  })

  test('give created node text', () => {
    const vm = renderViewmodel()
    act(() => vm.createRootNode())
    act(() => vm.nodes[0].do.changeNodeText('changed node text'))
    expect(vm.nodes).toEqual([
      expect.objectContaining({
        text: 'changed node text',
        editing: false,
      }),
    ])
  })

  test('change node text', () => {
    const vm = renderViewmodel()
    act(() => vm.createRootNode())
    act(() => vm.nodes[0].do.changeNodeText('this will change'))
    act(() => vm.nodes[0].do.startToEdit())
    expect(vm.nodes).toEqual([
      expect.objectContaining({
        editing: true,
      }),
    ])
  })
})
