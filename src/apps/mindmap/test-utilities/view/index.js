import { query } from './queries'
import { expectations, definedElementExpects } from './expectations'
import {
  clickElement,
  doubleClickElement,
  queryElementByLabelText,
  queryElementByText,
  expect,
  waitFor,
  renderView,
  typeWithKeyboard,
  typeAndPressEnter,
  getInputSelection,
  queryAllElementsByRole,
} from '../dependencies'
import 'jest-styled-components'
import { mapObject } from 'utils/FunctionalProgramming'

const waitForDefinedElement = mapObject(
  definedElementExpects,
  (getExpectOptions) => getWaitForOptions({ getExpectOptions })
)

export const view = {
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
  waitFor: {
    ...waitForDefinedElement,
  },
}

export function getWaitForOptions({
  getExpectOptions,
  structureSample = definedElementExpects.nodeInput(),
}) {
  return (...args) =>
    proxyWaitFor({
      getTarget: () => getExpectOptions(...args),
      facade: structureSample,
    })

  function proxyWaitFor({ getTarget, facade }) {
    return new Proxy(facade, { get: getWaitFor })

    function getWaitFor(facade, key) {
      if (isDeeperProxyRequest(facade, key))
        return proxyWaitFor({
          getTarget: () => getTarget()[key],
          facade: facade[key],
        })

      return (...keyArgs) =>
        waitFor(() => {
          const target = getTarget()
          if (key in target) return target[key](...keyArgs)
          throwPropertiesError(target, key)
        })
    }
  }

  function isDeeperProxyRequest(target, key) {
    return typeof target[key] === 'object' && target[key] !== null
  }
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

function expectToHaveInputSelection(expectToBeTrue) {
  return (Element) => (expectation) => {
    const inputSelection = getInputSelection(Element)
    if (expectToBeTrue) expect(inputSelection).toBe(expectation)
    if (!expectToBeTrue) expect(inputSelection).not.toBe(expectation)
  }
}

function createRootNodeUsingActionPanel() {
  const Button = queryElementByLabelText('create root node')
  return clickElement(Button)
}

function throwPropertiesError(target, key) {
  throw new Error(
    `${key} is not part of the available properties:` +
      Object.keys(target)
        .map((key) => `\n- ${key}`)
        .join('')
  )
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
