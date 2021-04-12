import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { queryNodeInput } from '../components/MainView/testUtilities'
import { v4 as uuidv4 } from 'uuid'

export function generateUniqueText() {
  return uuidv4()
}

export async function createTrees(trees) {
  if (trees?.length) {
    for (const tree of trees) {
      const RootNode = await createRootNodeWithProperties({ text: tree.text })
      await createChildTrees(RootNode, tree?.children)
    }
  }
}

export async function createChildTrees(ParentNode, trees) {
  if (trees?.length) {
    for (const tree of trees) {
      const RootNode = await createChildNodeWithProperties(ParentNode, {
        text: tree.text,
      })
      await createChildTrees(RootNode, tree?.children)
    }
  }
}

export function expectTreesToBeVisible(trees) {
  trees?.forEach((tree) => {
    expect(screen.getByText(tree.text)).toBeVisible()
    expectTreesToBeVisible(tree.children)
  })
}

export function createRootNode() {
  const MainView = screen.getByLabelText('main view')
  fireEvent.doubleClick(MainView)
}

export function createChildNode(ParentNode) {
  userEvent.type(ParentNode, 'c')
}

export async function createChildNodeWithProperties(
  ParentNode,
  { text, ...rest }
) {
  const NodesDifference = await findNodeDifferences(async () => {
    createChildNode(ParentNode)
    await completeNodeNaming(text)
  })

  return NodesDifference[0]
}

export async function createRootNodeWithProperties({ text, ...rest }) {
  const NodesDifference = await findNodeDifferences(async () => {
    createRootNode()
    await completeNodeNaming(text)
  })

  return NodesDifference[0]
}

export async function completeNodeNaming(text) {
  const InputNode = await findNodeInput()
  userEvent.type(InputNode, text)
  userEvent.type(InputNode, '{enter}')

  await waitForNodeInputToDisappear()
}

export async function findNodeDifferences(callback) {
  const NodesBefore = getButtons()
  await callback()
  const NodesAfter = getButtons()

  return findDifferencesOnKey({ NodesBefore, NodesAfter })

  function getButtons() {
    return screen.queryAllByRole('button')
  }

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

export function findNodeInput() {
  return screen.findByLabelText(nodeInputLabel)
}

export async function waitForNodeInputToDisappear() {
  await waitFor(() => expect(queryNodeInput()).toBeNull())
}

export function queryNode(args) {
  const { text } = args

  if (text) return screen.queryByText(text)

  throw new Error('unknown args')
}

const nodeInputLabel = 'editing node'
