import label from 'src/specifications/element-labels'
import { queryElement, queryElements } from '../dependency-wrappers'

const text = {
  tabs: { untitled: 'untitled' },
}

export const definedElementQueries = {
  label: (...args) => queryElement('label', ...args),
  text: (...args) => queryElement('text', ...args),
  focus: () => queryElement('focused'),
  tab: queryTab,
  tabInput: () => queryElement('label', label.tabs.tabInput),
  untitledTab: queryUntitledTab,
  nodeInput: () => queryElement('label', label.nodeInput),
  node: queryNode,
  childLink: queryChildLink,
  linkAnchor: queryLinkAnchor,
  rootTree: queryRootTree,
  mindSpace: () => queryElement('label', label.mindSpace),
  linkSpace: () => queryElement('label', label.linkSpace),
  nodeSpace: () => queryElement('label', label.nodeSpace),
  createRootNodeButton: () =>
    queryElement('label', label.button.createRootNode),
  createTabButton: () => queryElement('label', label.button.createTab),
  undoButton: () => queryElement('label', label.button.undo),
  redoButton: () => queryElement('label', label.button.redo),
}

export const query = {
  ...definedElementQueries,
  allElements: queryAllElements,
  allNodes: queryAllNodes,
  allUntitledTabs: queryAllUntitledTabs,
  relevantResizeElements: queryRelevantResizeElements,
}

function queryNode({ text }) {
  const nodes = queryElements('label', label.node)
  return nodes.find((node) => node.textContent === text)
}

function queryAllNodes() {
  return queryElements('role', 'button')
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
  return queryElement('label', label.mindSpace)
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
  const Tabs = Array.from(queryElement('label', 'tabs').children)
  if (id) return Tabs.filter((Tab) => Tab.getAttribute('data-id') === id)
  return Tabs.filter((Tab) => Tab.textContent === name)
}

function queryTabInput() {
  return queryElement('label', label.tabs.tabInput)
}

function queryTab({ index, id, name, numberOfFirstMatchesToSkip = 0 }) {
  if (index || index === 0) {
    const TabsContainer = queryElement('label', 'tabs')
    return TabsContainer.children[index]
  }
  const MatchedTabs = queryAllTabs({ id, name })
  if (!MatchedTabs.length) return null
  return MatchedTabs[numberOfFirstMatchesToSkip]
}

function queryChildLink() {
  const childLinks = queryElements('label', label.childLink)
  if (!childLinks.length) return null
  if (childLinks.length === 1) return childLinks[0]
}

function queryLinkAnchor(anchorId) {
  const linkAnchors = queryElements('label', label.linkAnchor)
  return linkAnchors.find(
    (anchor) => anchor.getAttribute('data-id') === anchorId
  )
}
