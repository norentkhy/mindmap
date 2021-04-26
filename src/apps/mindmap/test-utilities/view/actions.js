import { query } from './queries'
import { waitForExpectation } from './wait-for-expectations'
import {
  debugView,
  clickElement,
  doubleClickElement,
  queryElementByLabelText,
  typeWithKeyboard,
  typeAndPressEnter,
  getFocus,
} from '../dependencies'

const queryNode = query.node
const queryTab = query.tab
const queryAllNodes = query.allNodes
const waitForNodeInputToHaveFocus = async () =>
  await waitForExpectation.nodeInput().toHaveFocus()
const waitForNodeInputNotToBeVisible = async () =>
  await waitForExpectation.nodeInput().not.toBeVisible()

export const action = {
  sequence: {
    createRootNodeWithProperties,
    createChildNodeWithProperties,
    createTrees,
  },
  keyboard: {
    foldSelectedNode,
    createChildNodeOfSelectedNode,
    typeAndPressEnter,
  },
  mouse: {
    createRootNode,
    editSelectedNode,
    createNew: {
      tab: addNewTab,
    },
    rename: {
      tab: renameTab,
    },
    clickOn: {
      node: selectNode,
      tab: selectTab,
      menu: {
        createRootNode: createRootNodeUsingActionPanel,
        undoAction,
        redoAction,
      },
    },
  },
}

function addNewTab() {
  const AddNewTabButton = queryElementByLabelText('add new tab')
  clickElement(AddNewTabButton)
}

function selectTab(tab) {
  const Tab = queryTab(tab)
  clickElement(Tab)
}

function renameTab(tab) {
  const Tab = queryTab(tab)
  doubleClickElement(Tab)
}

function selectNode({ text }) {
  const Target = queryNode({ text })
  return clickElement(Target)
}

function foldSelectedNode() {
  return typeWithKeyboard('f')
}

function createChildNodeOfSelectedNode() {
  return typeWithKeyboard('c')
}

function createRootNode() {
  const MindSpace = queryElementByLabelText('main view')
  return doubleClickElement(MindSpace)
}

function editSelectedNode() {
  return typeWithKeyboard('{enter}')
}

function createRootNodeUsingActionPanel() {
  const Button = queryElementByLabelText('create root node')
  return clickElement(Button)
}

function undoAction() {
  const UndoActionButton = queryElementByLabelText('undo action')
  clickElement(UndoActionButton)
}

function redoAction() {
  const RedoActionButton = queryElementByLabelText('redo action')
  clickElement(RedoActionButton)
}

async function createChildNodeWithProperties({ text, ...rest }) {
  const NodesDifference = await findNodeDifferences(async () => {
    createChildNodeOfSelectedNode()
    await completeNodeNaming(text)
  })

  return NodesDifference[0]
}

async function createRootNodeWithProperties({ text, ...rest }) {
  const NodesDifference = await findNodeDifferences(async () => {
    createRootNode()
    await completeNodeNaming(text)
  })

  return NodesDifference[0]
}

async function completeNodeNaming(text) {
  await waitForExpectation.nodeInput().toHaveFocus()
  typeAndPressEnter(text)
  await waitForExpectation.nodeInput().not.toBeVisible()
}

async function findNodeDifferences(callback) {
  const NodesBefore = queryAllNodes()
  await callback()
  const NodesAfter = queryAllNodes()

  return findDifferencesOnKey({ NodesBefore, NodesAfter })

  function findDifferencesOnKey({ NodesBefore, NodesAfter }) {
    const keysElementsBefore = NodesBefore.map((element) => getKey(element))

    return NodesAfter.filter((elementAfter) => {
      const keyElementAfter = getKey(elementAfter)
      return !keysElementsBefore.includes(keyElementAfter)
    })
  }

  function getKey(Element) {
    const objectKeys = Object.keys(Element)
    const fiberSomething = Element[objectKeys[0]]
    return getMeaningfulKey(fiberSomething)

    function getMeaningfulKey(obj) {
      if (obj?.key) return obj.key
      if (obj.return) return getMeaningfulKey(obj.return)
      return null
    }
  }
}

async function createTrees(trees) {
  if (trees?.length) {
    for (const tree of trees) {
      const RootNode = await createRootNodeWithProperties({ text: tree.text })
      await createChildTrees(RootNode, tree?.children)
    }
  }
}

async function createChildTrees(ParentNode, trees) {
  if (trees?.length) {
    for (const tree of trees) {
      clickElement(ParentNode)
      const RootNode = await createChildNodeWithProperties({
        text: tree.text,
      })
      await createChildTrees(RootNode, tree?.children)
    }
  }
}
