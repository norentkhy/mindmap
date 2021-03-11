import React from 'react';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MindMap } from './MindMap';
import {
  createRootNodeWithProperties,
  generateUniqueText,
  createChildNodeWithProperties,
  createTrees,
  expectTreesToBeVisible,
  findNodeDifferences,
  queryNode,
  createRootNode,
  findNodeInput,
  completeNodeNaming,
  waitForNodeInputToDisappear,
  createChildNode,
} from './MindMapTestUtilities';
import { queryNodeInput } from './MainView/testUtilities';

describe('utilities', () => {
  test('unique random text', () => {
    const generatedTexts = [];
    for (let i = 0; i < 1000; i++) {
      generatedTexts.push(generateUniqueText());
    }

    const generatedTextsSet = new Set(generatedTexts);
    expect(generatedTexts.length).toBe(generatedTextsSet.size);
  });

  describe('create a root node with properties', () => {
    test('basic functionality', async () => {
      render(<MindMap />);

      const text = generateUniqueText();
      await createRootNodeWithProperties({ text });

      const FoundNode = await screen.findByText(text);
      expect(FoundNode).toBeVisible();
    });

    test('returns the created node', async () => {
      render(<MindMap />);

      const text = generateUniqueText();
      const CreatedNode = await createRootNodeWithProperties({ text });

      const FoundNode = await screen.findByText(text);
      expect(CreatedNode).not.toBe(undefined);
      expect(FoundNode).toBe(CreatedNode);
    });
  });

  describe('create a child node with properties', () => {
    test('basic functionality', async () => {
      const ParentNode = await renderMindMapWithParentNode();

      const text = generateUniqueText();
      await createChildNodeWithProperties(ParentNode, { text });

      const FoundNode = await screen.findByText(text);
      expect(FoundNode).toBeVisible();
    });

    test('returns the created node', async () => {
      const ParentNode = await renderMindMapWithParentNode();

      const text = generateUniqueText();

      const CreatedNode = await createChildNodeWithProperties(ParentNode, {
        text,
      });

      const FoundNode = await screen.findByText(text);
      expect(CreatedNode).not.toBe(undefined);
      expect(CreatedNode).toBeVisible(FoundNode);
    });

    async function renderMindMapWithParentNode() {
      render(<MindMap />);
      let parentText = generateUniqueText();
      return await createRootNodeWithProperties({ text: parentText });
    }
  });

  test('query a node', async () => {
    render(<MindMap />);

    const rootNode = { text: 'root' };
    expect(queryNode(rootNode)).toBeNull();

    await createRootNodeWithProperties(rootNode);
    expect(queryNode(rootNode)).toBeVisible();

    const childNode = { text: 'child' };
    expect(queryNode(childNode)).toBeNull();

    await createRootNodeWithProperties(childNode);
    expect(queryNode(childNode)).toBeVisible();
  });

  test('find differences', async () => {
    render(<MindMap />);
    await createRootNodeWithProperties({ text: 'not this one' });

    const targettedText = 'this one';
    const Differences = await findNodeDifferences(async () => {
      await createRootNodeWithProperties({ text: targettedText });
      await screen.findByText(targettedText);
    });
    expect(Differences.length).toBe(1);
    Differences[0].focus();
    expect(Differences[0]).toEqual(screen.getByText(targettedText));
  });

  test.each([
    [[]],
    [[{ text: generateUniqueText() }]],
    [
      [
        {
          text: generateUniqueText(),
          children: [{ text: generateUniqueText() }],
        },
      ],
    ],
    [
      [
        {
          text: generateUniqueText(),
          children: [
            {
              text: generateUniqueText(),
              children: [{ text: generateUniqueText() }],
            },
          ],
        },
      ],
    ],
  ])('create a mindmap from tree datastructures', async (trees) => {
    render(<MindMap />);
    await createTrees(trees);
    expectTreesToBeVisible(trees);
  });
});
