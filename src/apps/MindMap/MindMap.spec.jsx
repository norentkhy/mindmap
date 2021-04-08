import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import MindMap from './MindMap'
import userEvent from '@testing-library/user-event'
import { foldNode, queryNodeInput } from './components/MainView/testUtilities'
import {
  createRootNode,
  completeNodeNaming,
  createRootNodeWithProperties,
  createChildNode,
  createTrees,
  queryNode,
  findNodeInput,
} from './MindMapTestUtilities'
import { createMockResizeObserverHook } from 'test-utils/react-mocks'
import 'jest-styled-components'

const spy = jest.spyOn(global.console, 'error')
afterEach(() => expect(spy).not.toHaveBeenCalled())

describe('view elements', () => {
  test('tabs', () => {
    render(<MindMap />)
    screen.getByLabelText(/^tabs$/i)
  })

  test('actions', () => {
    render(<MindMap />)
    screen.getByLabelText(/^actions$/i)
  })

  test('main view', () => {
    render(<MindMap />)
    screen.getByLabelText(/^main view$/i)
  })
})

describe('tabs integration', () => {
  test('add a new tab', () => {
    render(<MindMap />)
    expect(screen.queryByText('untitled')).toBeNull()

    fireEvent.click(screen.getByLabelText('add new tab'))
    expect(screen.getByText('untitled')).toBeVisible()

    fireEvent.click(screen.getByLabelText('add new tab'))
    expect(screen.getAllByText('untitled').length).toBe(2)
  })

  test('rename a tab', () => {
    render(<MindMap />)
    fireEvent.click(screen.getByLabelText('add new tab'))
    fireEvent.doubleClick(screen.getByText('untitled'))

    const someNewTitle = 'some new title'
    userEvent.type(document.activeElement, someNewTitle)
    userEvent.type(document.activeElement, '{enter}')

    expect(screen.getByText(someNewTitle)).toBeVisible()
  })
})

describe('main view integration', () => {
  test('create a rootnode and edit its content', async () => {
    render(<MindMap />)

    createRootNode()

    const InputNode = queryNodeInput()
    expect(InputNode).toBeVisible()
    expect(InputNode).toHaveFocus()

    const someNewText = 'some new text'
    await completeNodeNaming(someNewText)

    await waitFor(() => expect(queryNodeInput()).toBeNull())
    expect(screen.getByText(someNewText)).toBeVisible()
  })

  test('create multiple rootnodes', async () => {
    render(<MindMap />)

    const rootTexts = ['root node 1', 'root node 2']
    for (const text of rootTexts) {
      await createRootNodeWithProperties({ text })
      const CreatedNode = await screen.findByText(text)
      expect(CreatedNode).toBeVisible()
    }
  })

  test('create a childnode', async () => {
    render(<MindMap />)
    const rootText = 'root text'
    await createRootNodeWithProperties({ text: rootText })

    const ParentNode = screen.getByText(rootText)
    createChildNode(ParentNode)
    const ChildInput = await findNodeInput()
    expect(ChildInput).toBeVisible()
    await waitFor(() => {
      expect(ChildInput).toHaveFocus()
    })

    const childText = 'child text'
    await completeNodeNaming(childText)

    expect(queryNodeInput()).toBeNull()
    ;[rootText, childText].forEach((text) => {
      expect(screen.getByText(text)).toBeVisible()
    })
  })

  test('fold a node', async () => {
    render(<MindMap />)
    const texts = [
      {
        notFoldedAway: 'unaffected1',
        toFold: 'fold this1',
        foldedAway: 'folded away1',
      },
      {
        notFoldedAway: 'unaffected2',
        toFold: 'fold this2',
        foldedAway: 'folded away2',
      },
    ]
    const trees = texts.map(generateFoldTree)
    await createTrees(trees)

    for (const text of texts) {
      expect(screen.getByText(text.foldedAway)).toBeVisible()

      const NodeToFold = screen.getByText(text.toFold)
      foldNode(NodeToFold)
      await waitFor(() =>
        expect(screen.queryByText(text.foldedAway)).toBeNull()
      )

      foldNode(NodeToFold)
      await waitFor(() =>
        expect(screen.getByText(text.foldedAway)).toBeVisible()
      )
    }

    function generateFoldTree({ notFoldedAway, toFold, foldedAway }) {
      return {
        text: notFoldedAway,
        children: [{ text: toFold, children: [{ text: foldedAway }] }],
      }
    }
  })

  test('editing node text', async () => {
    render(<MindMap />)
    const rootNode = { text: 'root node' }
    const RootNode = await createRootNodeWithProperties(rootNode)

    userEvent.type(RootNode, '{enter}')
    const NodeInput = await findNodeInput()
    expect(NodeInput).toBeVisible()
    await waitFor(() => {
      expect(NodeInput).toHaveFocus()
    })

    const newText = 'some new text'
    userEvent.type(NodeInput, newText)
    userEvent.type(NodeInput, '{enter}')
    expect(queryNode({ text: newText }))
  })

  describe('undo/redo', () => {
    test('creation of rootnode', async () => {
      render(<MindMap />)

      const rootNode = { text: 'root node' }

      const RootNode = await createRootNodeWithProperties(rootNode)
      expect(RootNode).toBeVisible()

      const UndoActionButton = screen.getByLabelText('undo action')
      fireEvent.click(UndoActionButton)
      await waitFor(() => expect(screen.queryByText(rootNode.text)).toBeNull())
      expect(queryNodeInput()).toBeVisible()
      expect(queryNodeInput()).toHaveFocus()

      const EmptyScreen = screen
      fireEvent.click(UndoActionButton)
      expect(screen).toEqual(EmptyScreen)

      fireEvent.click(UndoActionButton)
      await waitFor(() => expect(screen.queryByText(rootNode.text)).toBeNull())

      const RedoActionButton = screen.getByLabelText('redo action')
      fireEvent.click(RedoActionButton)
      await waitFor(() => expect(queryNodeInput()).toBeVisible)

      fireEvent.click(RedoActionButton)
      await waitFor(() => expect(screen.getByText(rootNode.text)).toBeVisible)

      const NonEmptyScreen = screen
      fireEvent.click(RedoActionButton)
      expect(screen).toEqual(NonEmptyScreen)
    })
  })
})

describe('mocks due to test environment', () => {
  const sample = {
    boundingClientRect: {
      left: 101,
      top: 102,
      right: 203,
      bottom: 204,
      width: 105,
      height: 106,
      x: 101,
      y: 102,
    },
    offsetRect: {
      offsetLeft: 5,
      offsetTop: 3,
      offsetWidth: 10,
      offsetHeight: 4,
    },
  }

  test('mock resize observer', async () => {
    const { fireResizeEvent, logResize } = renderMindMapWithMockResizeObserver()

    const Node = await createRootNodeWithProperties({ text: 'test' })
    expect(logResize).toBeCalled()

    const { boundingClientRect, offsetRect } = sample
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = offsetRect
    act(() => fireResizeEvent(Node, { boundingClientRect, offsetRect }))

    expect(logResize).toBeCalledWith(
      expect.objectContaining({
        boundingClientRect,
        offsetRect: {
          left: offsetLeft,
          top: offsetTop,
          width: offsetWidth,
          height: offsetHeight,
        },
      })
    )
  })

  test('all elements resize', async () => {
    const { fireResizeEvent, container } = renderMindMapWithMockResizeObserver()
    await createRootNodeWithProperties({ text: 'test' })
    const { boundingClientRect, offsetRect } = sample

    getAllElements(container).forEach((Element) =>
      act(() => fireResizeEvent(Element, { boundingClientRect, offsetRect }))
    )
  })

  test('resize elements specifically', async () => {
    const { fireResizeEvent, container } = renderMindMapWithMockResizeObserver()
    await createRootNodeWithProperties({ text: 'test' })

    getAllElements(container).forEach((Element) => {
      if (isSurface(Element)) resizeSurface(Element)
      if (isRootContainer(Element)) resizeRootContainer(Element)
      if (isNode(Element)) resizeNode(Element)
    })

    getAllElements(container).forEach((Element) => {
      if (isRootContainer(Element)) {
        expect(Element).toHaveStyleRule('position', 'absolute')
        expect(Element).toHaveStyleRule('left', '280px')
        expect(Element).toHaveStyleRule('top', '225px')
      }
    })

    function resizeSurface(Element) {
      const Rect = { left: 0, top: 0, width: 640, height: 480 }
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect: Rect,
          offsetRect: mapRectToOffset(Rect),
        })
      )
    }

    function resizeRootContainer(Element) {
      const Rect = { left: 0, top: 0, width: 100, height: 30 }
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect: Rect,
          offsetRect: mapRectToOffset(Rect),
        })
      )
    }

    function resizeNode(Element) {
      const Rect = { left: 0, top: 5, width: 80, height: 20 }
      act(() =>
        fireResizeEvent(Element, {
          boundingClientRect: Rect,
          offsetRect: mapRectToOffset(Rect),
        })
      )
    }

    function mapRectToOffset({ left, top, width, height }) {
      return {
        offsetLeft: left,
        offsetTop: top,
        offsetWidth: width,
        offsetHeight: height,
      }
    }

    function isSurface(Element) {
      return Element.getAttribute('aria-label') === 'main view'
    }

    function isRootContainer(Element) {
      return Element.getAttribute('aria-label') === 'container of rootnode'
    }

    function isNode(Element) {
      return Element.getAttribute('aria-label') === 'node'
    }
  })

  function getAllElements(container) {
    return getAllChildElements(container)

    function getAllChildElements(Element) {
      const ChildElements = Array.from(Element.children)
      if (!ChildElements) return []
      return [
        Element,
        ...ChildElements.flatMap((Element) => getAllChildElements(Element)),
      ]
    }
  }

  function renderMindMapWithMockResizeObserver() {
    const {
      useMockResizeObserver,
      fireResizeEvent,
    } = createMockResizeObserverHook()
    const logResize = jest.fn()

    const { container } = render(
      <MindMap
        useThisResizeObserver={useMockResizeObserver}
        logResize={logResize}
      />
    )

    return { fireResizeEvent, logResize, container }
  }
})
