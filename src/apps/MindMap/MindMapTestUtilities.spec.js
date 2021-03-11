import React from 'react';
import { render, screen } from '@testing-library/react';
import { MindMap } from './MindMap';
import {
  createRootNodeWithProperties,
  generateUniqueText,
  createChildNodeWithProperties,
  createTrees,
  expectTreesToBeVisible,
  findDifferences,
  queryNode,
} from './MindMapTestUtilities';

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
    test('basic functionality', () => {
      render(<MindMap />);

      const text = generateUniqueText();
      createRootNodeWithProperties({ text });

      const FoundNode = screen.getByText(text);
      expect(FoundNode).toBeVisible();
    });

    test('returns the created node', () => {
      render(<MindMap />);

      const text = generateUniqueText();
      const CreatedNode = createRootNodeWithProperties({ text });

      const FoundNode = screen.getByText(text);
      expect(FoundNode).toBe(CreatedNode);
    });
  });

  describe('create a child node with properties', () => {
    test('basic functionality', () => {
      const ParentNode = renderMindMapWithParentNode();

      const text = generateUniqueText();
      createChildNodeWithProperties(ParentNode, { text });

      expect(screen.getByText(text)).toBeVisible();
    });

    test('returns the created node', () => {
      const ParentNode = renderMindMapWithParentNode();

      const text = generateUniqueText();
      const CreatedNode = createChildNodeWithProperties(ParentNode, {
        text,
      });

      const FoundNode = screen.getByText(text);
      expect(CreatedNode).toBeVisible(FoundNode);
    });

    function renderMindMapWithParentNode() {
      render(<MindMap />);
      let parentText = generateUniqueText();
      return createRootNodeWithProperties({ text: parentText });
    }
  });

  test('query a node', () => {
    render(<MindMap />);

    const rootNode = { text: 'root' };
    expect(queryNode(rootNode)).toBeNull();

    createRootNodeWithProperties(rootNode);
    expect(queryNode(rootNode)).toBeVisible();

    const childNode = { text: 'child' };
    expect(queryNode(childNode)).toBeNull();

    createRootNodeWithProperties(childNode);
    expect(queryNode(childNode)).toBeVisible();
  });

  test('find differences', () => {
    render(<MindMap />);
    createRootNodeWithProperties({ text: 'not this one' });

    const targettedText = 'this one';
    const Differences = findDifferences(() =>
      createRootNodeWithProperties({ text: targettedText })
    );
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
  ])('create a mindmap from tree datastructures', (trees) => {
    render(<MindMap />);
    createTrees(trees);
    expectTreesToBeVisible(trees);
  });
});
