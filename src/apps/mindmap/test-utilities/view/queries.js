import {
  queryElementByLabelText,
  queryElementByText,
  getFocus,
  queryAllElementsByRole,
} from '../dependencies'

const label = {
  mindSpace: 'main view',
  rootTree: 'container of rootnode',
  node: 'node',
  nodeInput: 'editing node',
  tabs: { tabInput: 'renaming this tab' },
  button: {
    createRootNode: 'create root node',
    createTab: 'add new tab',
    undo: 'undo action',
    redo: 'redo action',
  },
}

const text = {
  tabs: { untitled: 'untitled' },
}

export const definedElementQueries = {
  label: queryElementByLabelText,
  text: queryElementByText,
  focus: getFocus,
  tab: queryTab,
  tabInput: queryTabInput,
  untitledTab: queryUntitledTab,
  nodeInput: queryNodeInput,
  node: queryNode,
  rootTree: queryRootTree,
  mindSpace: () => queryElementByLabelText(label.mindSpace),
  createRootNodeButton: () =>
    queryElementByLabelText(label.button.createRootNode),
  createTabButton: () => queryElementByLabelText(label.button.createTab),
  undoButton: () => queryElementByLabelText(label.button.undo),
  redoButton: () => queryElementByLabelText(label.button.redo),
}

export const query = {
  ...definedElementQueries,
  allElements: queryAllElements,
  allNodes: queryAllNodes,
  allUntitlesTabs: queryAllUntitledTabs,
  relevantResizeElements: queryRelevantResizeElements,
}

function queryNode({ text }) {
  return queryElementByText(text)
}

function queryAllNodes() {
  return queryAllElementsByRole('button')
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
  return queryElementByLabelText(label.mindSpace)
}

function isMindSpace(Element) {
  return Element.getAttribute('aria-label') === label.mindSpace
}

function isRootTree(Element) {
  return Element.getAttribute('aria-label') === label.rootTree
}

function isNode(Element) {
  return Element.getAttribute('aria-label') === label.node
}

function queryRootTree(node) {
  const Node = queryNode(node)
  return getRootTree(Node)
}

function getRootTree(Node) {
  const ParentElement = Node.parentElement
  if (!ParentElement) throw new Error('no root container')
  if (ParentElement.getAttribute('aria-label') === label.rootTree)
    return ParentElement
  else return getRootTree(ParentElement)
}

function queryUntitledTab() {
  const Tabs = queryAllUntitledTabs()
  if (Tabs.length === 0) return null
  if (Tabs.length > 1)
    console.warn('multiple untitled tabs found: use queryAllUntitledTabs')
  return Tabs[0]
}

function queryAllUntitledTabs() {
  return queryAllTabs({ name: text.tabs.untitled })
}

function queryAllTabs({ id, name }) {
  const Tabs = Array.from(queryElementByLabelText('tabs').children)
  if (id) return Tabs.filter((Tab) => Tab.getAttribute('data-id') === id)
  return Tabs.filter((Tab) => Tab.textContent === name)
}

function queryTabInput() {
  return queryElementByLabelText(label.tabs.tabInput)
}

function queryTab({ index, id, name, numberOfFirstMatchesToSkip = 0 }) {
  if (index || index === 0) {
    const TabsContainer = queryElementByLabelText('tabs')
    return TabsContainer.children[index]
  }
  const MatchedTabs = queryAllTabs({ id, name })
  if (!MatchedTabs.length) return null
  return MatchedTabs[numberOfFirstMatchesToSkip]
}
