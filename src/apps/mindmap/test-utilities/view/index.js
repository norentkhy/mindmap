import { query } from './queries'
import { expectations } from './expectations'
import { waitForExpectation, getWaitForOptions } from './wait-for-expectations'
import {
  clickElement,
  doubleClickElement,
  queryElementByLabelText,
  queryElementByText,
  renderView,
  typeWithKeyboard,
  typeAndPressEnter,
  queryAllElementsByRole,
} from '../dependencies'
import 'jest-styled-components'

const view = {
  render: renderView,
  query,
  action: {
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
  },
  expect: expectations,
  waitFor: waitForExpectation,
}

function queryNode({ text }) {
  return queryElementByText(text)
}

function queryAllNodes() {
  return queryAllElementsByRole('button')
}

function queryAllTabs({ id, title }) {
  const Tabs = Array.from(queryElementByLabelText('tabs').children)
  if (id) return Tabs.filter((Tab) => Tab.getAttribute('data-id') === id)
  return Tabs.filter((Tab) => Tab.textContent === title)
}

function queryTab({ index, id, title, numberOfFirstMatchesToSkip = 0 }) {
  if (index || index === 0) {
    const TabsContainer = queryElementByLabelText('tabs')
    return TabsContainer.children[index]
  }
  const MatchedTabs = queryAllTabs({ id, title })
  if (!MatchedTabs.length) return null
  return MatchedTabs[numberOfFirstMatchesToSkip]
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
  await view.waitFor.nodeInput().toHaveFocus()
  view.action.keyboard.typeAndPressEnter(text)
  await view.waitFor.nodeInput().not.toBeVisible()
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

export { getWaitForOptions, view }
