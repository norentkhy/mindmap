import { query, definedElementQueries } from './queries'
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
import produce from 'immer'

const label = {
  nodeInput: 'editing node',
  tabs: { tabInput: 'renaming this tab' },
}

const text = {
  tabs: { untitled: 'untitled' },
}

const definedElementExpects = mapObject(definedElementQueries, expectElement)
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
  expect: produce(definedElementExpects, (draftExpect) => {
    draftExpect.element = (queryElement) => expectElement(queryElement)()

    if (!draftExpect.numberOf) draftExpect.numberOf = {}
    //TODO encapsulate this feature for all multi element queries
    draftExpect.numberOf.untitledTabs = () => {
      const UntitledTabs = queryAllUntitledTabs()
      return {
        toBe: (amount) => expect(UntitledTabs.length).toBe(amount),
      }
    }
  }),
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

function expectElement(queryElement) {
  return (elementInfo) => {
    const Element = queryElement(elementInfo)
    const expectThisElement = expect(Element)
    return {
      toBeVisible: expectThisElement.toBeVisible,
      toHaveFocus: expectThisElement.toHaveFocus,
      toHaveStyle: expectToHaveStyle(true)(Element),
      toHaveTextSelection: expectToHaveInputSelection(true)(Element),
      not: {
        toBeVisible: expectThisElement.toBeNull,
        toHaveFocus: expectThisElement.not.toHaveFocus,
        toHaveStyle: expectToHaveStyle(false)(Element),
        toHaveTextSelection: expectToHaveInputSelection(false)(Element),
      },
    }
  }
}

function queryNode({ text }) {
  return queryElementByText(text)
}

function queryAllNodes() {
  return queryAllElementsByRole('button')
}

function queryAllUntitledTabs() {
  return queryAllTabs({ title: text.tabs.untitled })
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

function expectToHaveStyle(positiveExpectation) {
  return (Element) => (style) => {
    const styleEntries = Object.entries(style)
    styleEntries.forEach(expectToHaveStyleRule(positiveExpectation)(Element))
  }
}

function expectToHaveStyleRule(positiveExpectation) {
  if (positiveExpectation)
    return (Element) => (style) => expect(Element).toHaveStyleRule(...style)
  if (!positiveExpectation)
    return (Element) => (style) => expect(Element).not.toHaveStyleRule(...style)
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
