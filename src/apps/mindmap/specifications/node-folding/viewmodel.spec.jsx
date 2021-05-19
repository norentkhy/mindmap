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

describe('node-folding: viewmodel', () => {
  test('toggle fold: fold and unfold', () => {
    const vm = renderViewmodel()
    act(() => vm.createRootNode())
    act(() => vm.nodes[0].do.changeNodeText('fold this'))
    act(() => vm.nodes[0].do.createChild())
    act(() => vm.nodes[1].do.changeNodeText('child'))

    expect(vm.nodes[0]).toMatchObject({ folded: false })
    expect(vm.nodes.length).toBe(2)

    act(() => vm.nodes[0].do.toggleFold())
    expect(vm.nodes[0]).toMatchObject({ folded: true })
    expect(vm.nodes.length).toBe(1)

    act(() => vm.nodes[0].do.toggleFold())
    expect(vm.nodes[0]).toMatchObject({ folded: false })
    expect(vm.nodes.length).toBe(2)
  })
})
