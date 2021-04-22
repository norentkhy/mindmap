import { model } from '~mindmap/test-utilities'
import { describe, test, expect } from '@jest/globals'

describe('dimensions', () => {
  test('update of node layout dimensions', () => {
    const { state, action, actionSequence } = renderHookTestAndCreateRootNode()
    const { id } = state.getNewestRootNode()

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    action.registerNodeLayout({ id, boundingClientRect, offsetRect })

    const node = state.getNode(id)
    expect(node.measuredNode).toEqual({ boundingClientRect, offsetRect })
  })

  test('update of tree layout dimensions', () => {
    const { state, action, actionSequence } = renderHookTestAndCreateRootNode()
    const { id } = state.getNewestRootNode()

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    action.registerTreeLayout({ id, boundingClientRect, offsetRect })

    const node = state.getNode(id)
    expect(node.measuredTree).toEqual({ boundingClientRect, offsetRect })
  })

  test('update mind surface layout dimensions', () => {
    const { state, action, actionSequence } = model.render()

    const boundingClientRect = 'object containing bounding client rect'
    const offsetRect = 'object containing offset rect'
    action.registerSurfaceLayout({ boundingClientRect, offsetRect })

    const { measuredSurface } = state.getState()
    expect(measuredSurface).toEqual({ boundingClientRect, offsetRect })
  })

  function renderHookTestAndCreateRootNode() {
    const rendered = model.render()
    rendered.action.createRootNode()
    return rendered
  }
})

describe('logging of changes', () => {
  test('dimensions update', () => {
    const {
      state,
      action,
      actionSequence,
      log,
    } = renderHookTestWithNodeForLogging()

    const { id } = state.getNewestRootNode()
    const boundingClientRect = 'bounding client rectangle'
    const offsetRect = {
      offsetLeft: 'offset left',
      offsetTop: 'offset top',
      offsetWidth: 'offset width',
      offsetHeight: 'offset height',
    }
    action.registerNodeLayout({ id, boundingClientRect, offsetRect })

    model.expect
      .mockFunction(log)
      .toBeCalledWith({ id, boundingClientRect, offsetRect })

    function renderHookTestWithNodeForLogging() {
      const log = model.create.mockFunction()
      const rendered = model.render({
        extraModelProviderProps: { logResize: log },
      })
      rendered.action.createRootNode()

      return { ...rendered, log }
    }
  })
})
