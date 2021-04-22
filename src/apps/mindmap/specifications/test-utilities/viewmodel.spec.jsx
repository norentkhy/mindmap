import { model } from '~mindmap/test-utilities'

describe('utilities', () => {
  test('createRootNodeWithProperties', () => {
    const { state, action, actionSequence } = model.render()
    const text = 'tesadf'
    const rootNode = actionSequence.createRootNodeWithProperties({ text })

    const rootNodes = state.getRootNodes()

    expect(rootNodes.length).toBe(1)
    expect(rootNodes[0].id).toBe(rootNode.id)
  })

  test('captureNodeChanges', () => {
    const { state, action, actionSequence, stateObservation } = model.render()
    const firstRootNode = createAndCaptureFirstRootNode()
    createAndCaptureSecondRootNode()
    createAndCaptureFirstChildNode(firstRootNode.id)

    function createAndCaptureFirstRootNode() {
      const nodeChanges = stateObservation.captureNewNodes(() =>
        actionSequence.createRootNodeWithProperties({ text: 'asdf' })
      )

      expect(nodeChanges.length).toBe(1)
      expect(nodeChanges[0]).toMatchObject({ text: 'asdf', editing: false })

      return nodeChanges[0]
    }

    function createAndCaptureSecondRootNode() {
      const nodeChanges = stateObservation.captureNewNodes(() =>
        actionSequence.createRootNodeWithProperties({ text: 'second' })
      )

      expect(nodeChanges.length).toBe(1)
      expect(nodeChanges[0]).toMatchObject({ text: 'second', editing: false })
    }

    function createAndCaptureFirstChildNode(rootId) {
      const nodeChanges = stateObservation.captureNewNodes(() =>
        action.createChildNode(rootId)
      )

      expect(nodeChanges.length).toBe(1)
      expect(nodeChanges[0]).toMatchObject({ text: '', editing: true })
    }
  })

  test('createChildNodeWithProperties', () => {
    const { state, action, actionSequence, stateObservation } = model.render()

    const parent = actionSequence.createRootNodeWithProperties({
      text: 'parent',
    })

    const text = 'child'
    const newNodes = stateObservation.captureNewNodes(() =>
      actionSequence.createChildNodeWithProperties({
        parentId: parent.id,
        properties: { text },
      })
    )

    expect(newNodes.length).toBe(1)
    expect(newNodes[0]).toMatchObject({ text })
  })

  test('getNode', () => {
    const { state, action, actionSequence, stateObservation } = model.render()

    const parent = actionSequence.createRootNodeWithProperties({
      text: 'I am parent',
    })
    const child = actionSequence.createChildNodeWithProperties({
      parentId: parent.id,
      properties: { text: 'I am child' },
    })

    const node = state.getNode(child.id)

    expect(node.id).toBe(child.id)
  })
})
