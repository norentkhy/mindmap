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
  getFocus,
  getInputSelection,
} from './dependencies'
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

const queryDefinedElement = {
  byLabel: queryElementByLabelText,
  byText: queryElementByText,
  focus: getFocus,
  tab: queryTab,
  tabInput: queryTabInput,
  untitledTab: queryUntitledTab,
  nodeInput: queryNodeInput,
  node: queryNode,
  rootTree: queryRootTree,
  mindSpace: queryMindSpace,
}
const definedElementExpects = mapObject(queryDefinedElement, expectElement)
const waitForDefinedElement = mapObject(
  definedElementExpects,
  (getExpectOptions) => getWaitForOptions({ getExpectOptions })
)

export const view = {
  render: renderView,
  query: {
    ...queryDefinedElement,
    allElements: queryAllElements,
    relevantResizeElements: queryRelevantResizeElements,
  },
  keyboardAction: {
    foldSelectedNode,
    createChildNodeOfSelectedNode,
    typeAndPressEnter,
  },
  mouseAction: {
    createRootNode,
    editSelectedNode,
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
  createNew: {
    tab: addNewTab,
  },
  rename: {
    tab: renameTab,
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

function getRootTree(Node) {
  const ParentElement = Node.parentElement
  if (!ParentElement) throw new Error('no root container')
  if (ParentElement.getAttribute('aria-label') === 'container of rootnode')
    return ParentElement
  else return getRootTree(ParentElement)
}

function queryNode({ text }) {
  return queryElementByText(text)
}

function queryNodeInput() {
  return queryElementByLabelText(label.nodeInput)
}

function queryRelevantResizeElements() {
  const Elements = queryAllElements()
  const MindSpace = queryMindSpace()
  const RootTrees = Elements.filter(isRootTree)
  const Nodes = Elements.filter(isNode)

  return { MindSpace, RootTrees, Nodes }
}

function queryAllElements() {
  const ReactDiv = document.body.children[0]
  return queryAllChildElements(ReactDiv)

  function queryAllChildElements(Element) {
    const ChildElements = Array.from(Element.children)
    if (!ChildElements) return []
    return [
      Element,
      ...ChildElements.flatMap((Element) => queryAllChildElements(Element)),
    ]
  }
}

function queryMindSpace() {
  return queryElementByLabelText('main view')
}

function isMindSpace(Element) {
  return Element.getAttribute('aria-label') === 'main view'
}

function isRootTree(Element) {
  return Element.getAttribute('aria-label') === 'container of rootnode'
}

function isNode(Element) {
  return Element.getAttribute('aria-label') === 'node'
}

function queryRootTree(node) {
  const Node = queryNode(node)
  return getRootTree(Node)
}

function queryUntitledTab() {
  const Tabs = queryAllUntitledTabs()
  if (Tabs.length === 0) return null
  if (Tabs.length > 1)
    console.warn('multiple untitled tabs found: use queryAllUntitledTabs')
  return Tabs[0]
}

function queryAllUntitledTabs() {
  return queryAllTabs({ title: text.tabs.untitled })
}

function queryAllTabs({ id, title }) {
  const Tabs = Array.from(queryElementByLabelText('tabs').children)
  if (id) return Tabs.filter((Tab) => Tab.getAttribute('data-id') === id)
  return Tabs.filter((Tab) => Tab.textContent === title)
}

function queryTabInput() {
  return queryElementByLabelText(label.tabs.tabInput)
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
