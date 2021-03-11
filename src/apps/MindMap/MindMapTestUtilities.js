import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { queryNodeInput } from './MainView/MainView.spec';
import { v4 as uuidv4 } from 'uuid';

function generateUniqueText() {
  return uuidv4();
}
function createTrees(trees) {
  trees?.forEach((tree) => {
    const NodeDifferences = findNodeDifferences(() => {
      createRootNodeWithProperties({ text: tree.text });
    });
    const RootNode = NodeDifferences[0];
    createChildTrees(RootNode, tree?.children);
  });
}
function createChildTrees(ParentNode, trees) {
  trees?.forEach((tree) => {
    const NodeDifferences = findNodeDifferences(() => {
      createChildNodeWithProperties(ParentNode, { text: tree.text });
    });
    const RootNode = NodeDifferences[0];
    createChildTrees(RootNode, tree?.children);
  });
}
function expectTreesToBeVisible(trees) {
  trees?.forEach((tree) => {
    expect(screen.getByText(tree.text)).toBeVisible();
    expectTreesToBeVisible(tree.children);
  });
}
function createRootNode() {
  const MainView = screen.getByLabelText('main view');
  fireEvent.doubleClick(MainView);
}
function createChildNode(ParentNode) {
  userEvent.type(ParentNode, 'c');
}
function createChildNodeWithProperties(ParentNode, { text, ...rest }) {
  const NodesDifference = findNodeDifferences(() => {
    createChildNode(ParentNode);
    completeNodeNaming(text);
  });

  return NodesDifference[0];
}
function createRootNodeWithProperties({ text, ...rest }) {
  const NodesDifference = findNodeDifferences(() => {
    createRootNode();
    completeNodeNaming(text);
  });

  return NodesDifference[0];
}
function completeNodeNaming(text) {
  const InputNode = queryNodeInput();
  userEvent.type(InputNode, text);
  userEvent.type(InputNode, '{enter}');
}

function findNodeDifferences(callback) {
  const NodesBefore = getButtons();
  callback();
  const NodesAfter = getButtons();

  return findDifferencesOnKey({ NodesBefore, NodesAfter });

  function getButtons() {
    return screen.getAllByRole('button');
  }

  function findDifferencesOnKey({ NodesBefore, NodesAfter }) {
    const keysElementsBefore = NodesBefore.map((element) => getKey(element));

    return NodesAfter.filter((elementAfter) => {
      const keyElementAfter = getKey(elementAfter);
      return !keysElementsBefore.includes(keyElementAfter);
    });
  }

  function getKey(Element) {
    const objectKeys = Object.keys(Element);
    const fiberSomething = Element[objectKeys[0]];
    return fiberSomething?.return?.key;
  }
}

function queryNode(args) {
  const { text } = args;

  if (text) return screen.queryByText(text);

  throw new Error('unknown args');
}

export {
  findNodeDifferences as findDifferences,
  generateUniqueText,
  createTrees,
  expectTreesToBeVisible,
  createRootNode,
  createChildNode,
  createChildNodeWithProperties,
  createRootNodeWithProperties,
  completeNodeNaming,
  queryNode,
};
