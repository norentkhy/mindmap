import {
  visitMindmapApp,
  createChildNodeWithName,
  createRootNodeWithName,
  findNode,
  findAllLinkAnchors,
  findAllChildLinks,
  expectToFindLine,
  expectOffsetBetween,
} from 'src/test-utils/cypress'
import { Geometry, DOM } from 'src/data-structures'
import { mapObject } from 'src/utils/FunctionalProgramming'

export default function testNodeLines(describe, beforeEach, test, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  test('link made when relation exists between node', () => {
    createRootNodeWithName(cy, 'parent')
    createChildNodeWithName(cy, 'child')
    expectToFindLine(cy)
  })

  test('link exists between the two nodes', () => {
    createRootNodeWithName(cy, 'parent')
    createChildNodeWithName(cy, 'child')

    cy.all(
      findNode(cy, { text: 'parent' }),
      findNode(cy, { text: 'child' }),
      findAllChildLinks(cy)
    )
      .then(([[Parent], [Child], [Link]]) => {
        const Element = { parent: Parent, child: Child, link: Link }
        return mapObject(Element, Geometry.getCenterOffset)
      })
      .then((offset) => {
        expectOffsetBetween(offset.link, [offset.parent, offset.child])
      })
  })

  test('link anchors on edge of each node', () => {
    createRootNodeWithName(cy, 'parent')
    createChildNodeWithName(cy, 'child')

    cy.all(
      findNode(cy, { text: 'parent' }),
      findNode(cy, { text: 'child' }),
      findAllLinkAnchors(cy)
    )
      .then(([[Parent], [Child], [AnchorA, AnchorB]]) => {
        const nodeRects = DOM.getBoundingClientRects([Parent, Child])
        const anchorRects = DOM.getBoundingClientRects([AnchorA, AnchorB])
        return DOM.pairTouchingRects(anchorRects, nodeRects)
      })
      .then((rectPairs) => {
        rectPairs.forEach(([anchorOffset, nodeOffset]) => {
          expectAnchorOnNodeEdge(anchorOffset, nodeOffset)
        })
      })
  })
}

function expectAnchorOnNodeEdge(anchorRect, nodeRect) {
  const nodeEdges = Geometry.getRectEdges(nodeRect)
  const hasAnchorOnNodeEdge = nodeEdges.some((edge) =>
    Geometry.isRectOnEdge(anchorRect, edge)
  )
  expect(hasAnchorOnNodeEdge).to.be.true
}
