import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MindMap from '~mindmap/MindMap'
import { foldNode } from '~mindmap/components/MainView/testUtilities'
import { createTrees } from '~mindmap/MindMapTestUtilities'
import 'jest-styled-components'

describe('node folding: integration', () => {
  test('fold a node structure', async () => {
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
})
