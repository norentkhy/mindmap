import { Nodes } from '~mindmap/data-structures/index'
import computeActionPanelToRender from '~mindmap/data-structures/viewmodel-elements/compute-interactive-actions'
import { expectAnId, createMockFn } from '~mindmap/test-utilities/viewmodel'

const nodes = createNodesScenarios()
const noOpActions = createNoOpObject(['createRootNode'])
const noOpGeneralActions = createNoOpObject(['createNode'])
const timeline = {
  empty: {
    pasts: [],
    present: 'something',
    futures: [],
  },
}

describe('callbacks', () => {
  test('create node', () => {
    const createRootNode = createMockFn()
    const deps = createDeps({ actions: { createRootNode } })
    const actionPanel = computeActionPanelToRender(deps)

    callbackButton(actionPanel, { text: 'create root node' })
    expect(createRootNode).toBeCalledTimes(1)
  })

  test('undo and redo', () => {
    const undo = createMockFn()
    const redo = createMockFn()
    const deps = createDeps({ actions: { undo, redo } })
    const actionPanel = computeActionPanelToRender(deps)

    callbackButton(actionPanel, { text: 'undo' })
    expect(undo).nthCalledWith(1)

    callbackButton(actionPanel, { text: 'redo' })
    expect(redo).nthCalledWith(1)
  })

  test('give text to a newly created node', () => {
    const finalizeEditNode = createMockFn()
    const deps = createDeps({
      nodes: nodes.editingOneRootNode,
      actions: { finalizeEditNode },
    })
    const actionPanel = computeActionPanelToRender(deps)

    callbackButton(actionPanel, { text: 'submit text' })
    expect(finalizeEditNode).toBeCalledTimes(1)
  })

  test('create child node', () => {
    const createChildNode = createMockFn()
    const deps = createDeps({
      nodes: nodes.oneRootNode,
      actions: { createChildNode },
    })
    const actionPanel = computeActionPanelToRender(deps)

    const focusedId = Nodes.getFocusedId(deps.nodes)
    expect(focusedId).toEqual(expectAnId())

    callbackButton(actionPanel, { text: 'create child node' })
    expect(createChildNode).nthCalledWith(1, focusedId)
  })

  test('navigate nodes', () => {
    const shiftFocusTo = createMockFn()
    const deps = createDeps({
      nodes: nodes.oneRootNode,
      actions: { shiftFocusTo },
    })
    const actionPanel = computeActionPanelToRender(deps)

    callbackButton(actionPanel, { label: 'navigate left' })
    expect(shiftFocusTo).toBeCalledWith('left')
  })
})

function createDeps(newDeps) {
  return {
    nodes: newDeps.nodes || nodes.empty,
    actions: { ...noOpActions, ...newDeps.actions },
    timeline: newDeps.timeline || timeline.empty,
    generalActions: { ...noOpGeneralActions, ...newDeps.generalActions },
  }
}

function callbackButton(actionPanel, { text, label }) {
  const buttons = getAllButtons(actionPanel)
  const predicate =
    (text && ((btn) => btn.text === text)) ||
    (label && ((btn) => btn.label === label))
  const button = buttons.find(predicate)
  return button.callback(new MouseEvent('button'))
}

function getAllButtons(actionPanel) {
  return Object.values(actionPanel.buttons).flatMap((x) => x)
}

function createNodesScenarios() {
  const empty = Nodes.init()
  const editingOneRootNode = Nodes.createRoot(empty)
  const oneRootNode = giveEditingNodesText(editingOneRootNode, parent)

  return {
    empty,
    editingOneRootNode,
    oneRootNode,
  }
}

function giveEditingNodesText(nodes, text) {
  const editingIds = Nodes.getEditingIds(nodes)
  return editingIds.reduce(
    (newNodes, id) => Nodes.editContents(newNodes, id, { text }),
    nodes
  )
}

function createNoOpObject(keys) {
  const initialNoOpObject = {}
  return keys.reduce((noOpObject, key) => {
    noOpObject[key] = () => {}
    return noOpObject
  }, initialNoOpObject)
}
