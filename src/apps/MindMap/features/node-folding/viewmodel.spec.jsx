import {
  createRootNodeWithProperties,
  getNewestRootNode,
  renderHookTest,
} from '~mindmap/components/Contexts/TestUtilities'

import { act } from '@testing-library/react-hooks'
import { describe, test, expect } from '@jest/globals'

describe('node-folding: viewmodel', () => {
  test('toggle fold: fold and unfold', () => {
    const { result } = renderHookTest()
    const id = createRootNodeWithProperties(result, { text: 'root node' })

    const initialNode = getNewestRootNode(result)
    expect(initialNode.folded).toBeFalsy()

    act(() => result.current.foldNode(id))
    const foldedNode = getNewestRootNode(result)
    expect(foldedNode.folded).toBe(true)

    act(() => result.current.foldNode(id))
    const unfoldedNode = getNewestRootNode(result)
    expect(unfoldedNode.folded).toBe(false)
  })
})
