import { describe, test, expect } from '@jest/globals'
import { renderHook, act } from '@testing-library/react-hooks'
import useViewmodel from '../../components/Model/useViewmodel'
import { repeat } from '~/utils/FunctionalProgramming'

function renderViewmodel() {
  const { result } = renderHook(useViewmodel)

  return new Proxy(result.current, {
    get: (_target, prop) => result.current[prop],
    set: () => {
      throw new Error('modify state using the viewmodel handlers')
    },
  })
}

function getRelevantState(vm) {
  return {
    state: vm.state,
    nodes: vm.nodes.map((node) => {
      const copy = { ...node }
      delete copy.do
      return copy
    }),
  }
}

describe('prerequisites', () => {
  test('createRootNode changes relevant state', () => {
    const vm = renderViewmodel()
    const stateBefore = getRelevantState(vm)
    act(() => vm.createRootNode())
    expect(getRelevantState(vm)).not.toEqual(stateBefore)
  })
})

describe('undo and redo', () => {
  test('undo without any state changes', () => {
    const vm = renderViewmodel()
    const stateBefore = getRelevantState(vm)
    act(() => vm.undo())
    expect(getRelevantState(vm)).toEqual(stateBefore)
  })

  test('redo without any state changes', () => {
    const vm = renderViewmodel()
    const stateBefore = getRelevantState(vm)
    act(() => vm.redo())
    expect(getRelevantState(vm)).toEqual(stateBefore)
  })

  test('1 undo after 1 state change', () => {
    const vm = renderViewmodel()
    const stateBefore = getRelevantState(vm)
    act(() => vm.createRootNode())
    act(() => vm.undo())
    expect(getRelevantState(vm)).toEqual(stateBefore)
  })

  test('2 undo after 1 state change', () => {
    const vm = renderViewmodel()
    const stateBefore = getRelevantState(vm)
    act(() => vm.createRootNode())
    repeat(2, () => act(() => vm.undo()))
    expect(getRelevantState(vm)).toEqual(stateBefore)
  })

  test('1 redo after 1 undo after 1 state change', () => {
    const vm = renderViewmodel()
    act(() => vm.createRootNode())
    const stateAfter = getRelevantState(vm)
    act(() => vm.undo())
    act(() => vm.redo())
    expect(getRelevantState(vm)).toEqual(stateAfter)
  })

  test('2 redo after 1 undo after 1 state change', () => {
    const vm = renderViewmodel()
    act(() => vm.createRootNode())
    const stateAfter = getRelevantState(vm)
    act(() => vm.undo())
    repeat(2, () => act(() => vm.redo()))
    expect(getRelevantState(vm)).toEqual(stateAfter)
  })
})
