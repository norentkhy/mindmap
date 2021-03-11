import { renderHook, act } from '@testing-library/react-hooks';
import React, { createContext, useContext } from 'react';
import { MainViewProvider, MainViewContext } from './MainViewContext';

describe('core', () => {
  describe('create a root node', () => {
    test('create root node and set it to edit mode', () => {
      const { result } = renderUseMainViewContext();

      expect(result.current.state.trees).toEqual([]);

      act(() => result.current.createRootNode());
      expect(result.current.state.trees.length).toBe(1);

      const node = result.current.state.trees[0];
      expect(node.text).toBe('');
      expect(node.editing).toBe(true);
      expect(node.id).toBeTruthy();
    });

    test('receive command to initiate editing', () => {
      const { result } = renderUseMainViewContext();
      const initialText = 'initial';
      const id = createRootNodeWithProperties(result, { text: initialText });

      act(() => result.current.initiateEditNode(id));

      expect(getNewestRootNode(result).editing).toBe(true);
    });

    test('receive command to finalize editing', () => {
      const { result } = renderUseMainViewContext();

      act(() => result.current.createRootNode());
      const { id } = getNewestRootNode(result);
      const someNewText = 'some new text';

      act(() => result.current.finalizeEditNode({ id, text: someNewText }));
      expect(getNewestRootNode(result).text).toBe(someNewText);
    });

    test('make multiple rootnodes', () => {
      const { result } = renderUseMainViewContext();

      const nodeTexts = ['root1', 'root2'];
      nodeTexts.forEach((text) => {
        createRootNodeWithProperties(result, { text });
        expect(getNewestRootNode(result)).toMatchObject({ text });
      });
    });
  });

  describe('create a child node', () => {
    test('create a child node and set it to edit mode', () => {
      const { result } = renderUseMainViewContext();

      act(() => result.current.createRootNode());
      const parentNode = getNewestRootNode(result);
      act(() =>
        result.current.finalizeEditNode({
          id: parentNode.id,
          text: 'root node',
        })
      );

      act(() => result.current.createChildNode(parentNode.id));
    });
  });

  describe('fold a node', () => {
    test('fold a node', () => {
      const { result } = renderUseMainViewContext();

      createRootNodeWithProperties(result, { text: 'root node' });

      const initialNode = getNewestRootNode(result);
      const { id } = initialNode;
      expect(initialNode.folded).toBeFalsy();

      act(() => result.current.foldNode(id));

      const foldedNode = getNewestRootNode(result);
      expect(foldedNode.folded).toBe(true);

      act(() => result.current.foldNode(id));

      const unfoldedNode = getNewestRootNode(result);
      expect(unfoldedNode.folded).toBe(false);
    });
  });
});

describe('undo and redo', () => {
  test('undo and redo', () => {
    const { result } = renderUseMainViewContext();

    const stateBefore = getState(result);
    createNode();
    const stateAfter = getState(result);

    undo();
    expect(getState(result)).toEqual(stateBefore);

    undo();
    expect(getState(result)).toEqual(stateBefore);

    redo();
    expect(getState(result)).toEqual(stateAfter);

    redo();
    expect(getState(result)).toEqual(stateAfter);

    nameNode('this will be undone');
    const stateToBeUndone = getState(result);
    undo();
    nameNode('new name');
    redo();
    expect(getState(result)).not.toEqual(stateToBeUndone);

    function nameNode(text) {
      act(() =>
        result.current.finalizeEditNode({
          id: getNewestRootNode(result).id,
          text,
        })
      );
    }

    function createNode() {
      act(result.current.createRootNode);
    }

    function undo() {
      act(() => result.current.undo());
    }

    function redo() {
      act(() => result.current.redo());
    }
  });

  function doSomething(result) {
    const { state: stateBefore } = result.current;
    act(result.current.createRootNode);
    const { state: stateAfter } = result.current;

    return [stateBefore, stateAfter];
  }
});

describe('utilities', () => {
  test('createRootNodeWithProperties', () => {
    const { result } = renderUseMainViewContext();
    const text = 'tesadf';
    const rootNodeId = createRootNodeWithProperties(result, { text });

    const rootNodes = getRootNodes(result);

    expect(rootNodes.length).toBe(1);
    expect(rootNodes[0].id).toBe(rootNodeId);
  });

  test('captureNodeChanges', () => {
    const { result } = renderUseMainViewContext();
    const firstRootNode = createAndCaptureFirstRootNode();
    createAndCaptureSecondRootNode();
    createAndCaptureFirstChildNode(firstRootNode.id);

    function createAndCaptureFirstRootNode() {
      const nodeChanges = captureNewNodes({
        result,
        change: () => createRootNodeWithProperties(result, { text: 'asdf' }),
      });

      expect(nodeChanges.length).toBe(1);
      expect(nodeChanges[0]).toMatchObject({ text: 'asdf', editing: false });

      return nodeChanges[0];
    }

    function createAndCaptureSecondRootNode() {
      const nodeChanges = captureNewNodes({
        result,
        change: () => createRootNodeWithProperties(result, { text: 'second' }),
      });

      expect(nodeChanges.length).toBe(1);
      expect(nodeChanges[0]).toMatchObject({ text: 'second', editing: false });
    }

    function createAndCaptureFirstChildNode(rootId) {
      const nodeChanges = captureNewNodes({
        result,
        change: () => {
          act(() => result.current.createChildNode(rootId));
        },
      });

      expect(nodeChanges.length).toBe(1);
      expect(nodeChanges[0]).toMatchObject({ text: '', editing: true });
    }
  });

  test('createChildNodeWithProperties', () => {
    const { result } = renderUseMainViewContext();

    const parentId = createRootNodeWithProperties(result, { text: 'parent' });

    const text = 'child';
    const newNodes = captureNewNodes({
      result,
      change: () =>
        createChildNodeWithProperties({
          result,
          parentId,
          properties: { text },
        }),
    });

    expect(newNodes.length).toBe(1);
    expect(newNodes[0]).toMatchObject({ text });
  });
});

function captureNewNodes({ result, change }) {
  const oldNodes = getRootNodes(result);
  change();
  const nodes = getRootNodes(result);

  const newNodes = getNewNodes({ oldNodes, nodes });

  return newNodes;

  function getNewNodes({ oldNodes, nodes }) {
    const oldIds = getIds(oldNodes);
    const ids = getIds(nodes);
    const newIds = ids.filter((id) => !oldIds.includes(id));

    const newNodes = newIds.map((id) => getNode({ id, nodes }));

    return newNodes;

    function getIds(nodes) {
      return nodes.flatMap(({ children, id }) => {
        if (!children) return id;

        return [id, ...getIds(children)];
      });
    }

    function getNode({ id, nodes }) {
      if (nodes.length === 0) return null;

      const foundNode = nodes.find((node) => node.id === id);
      if (foundNode) return foundNode;

      const childNodes = nodes.reduce((childNodes, { children }) => {
        if (!children || children.length === 0) return childNodes;
        return [...childNodes, ...children];
      }, []);
      return getNode({ id, nodes: childNodes });
    }
  }
}

function renderUseMainViewContext() {
  return renderHook(() => useContext(MainViewContext), {
    wrapper: ({ children }) => <MainViewProvider>{children}</MainViewProvider>,
  });
}

function createRootNodeWithProperties(result, { text, ...others }) {
  act(() => result.current.createRootNode());
  const { id } = getNewestRootNode(result);
  act(() => result.current.finalizeEditNode({ id, text, ...others }));
  return id;
}

function createChildNodeWithProperties({
  result,
  parentId,
  properties: { text, ...others },
}) {
  const newNodes = captureNewNodes({
    result,
    change: () => {
      act(() => result.current.createChildNode(parentId));
    },
  });
  const { id } = newNodes[0];
  act(() => result.current.finalizeEditNode({ id, text, ...others }));
  return id;
}

function getRootNodes(result) {
  const state = getState(result);
  return state.trees;
}

function getNewestRootNode(result) {
  const rootNodes = getRootNodes(result);
  return rootNodes[rootNodes.length - 1];
}

function getState(result) {
  return result.current.state;
}
