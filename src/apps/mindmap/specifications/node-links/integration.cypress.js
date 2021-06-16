import {
  visitMindmapApp,
  createChildNodeWithName,
  createRootNodeWithName,
  findElementWithText,
  findAllLinkAnchors,
  findAllChildLinks,
  expectToFindLine,
  expectOffsetBetween,
} from '~mindmap/test-utilities/cypress'
import { Geometry } from '~mindmap/data-structures'
import { mapObject } from '~/utils/FunctionalProgramming'
import { DOM } from '../../data-structures/index'

export default function testNodeLines(describe, beforeEach, it, cy) {
  beforeEach(() => {
    visitMindmapApp(cy)
  })

  it('link made when relation exists between node', () => {
    createRootNodeWithName(cy, 'parent')
    createChildNodeWithName(cy, 'child')
    expectToFindLine(cy)
  })

  it('link exists between the two nodes', () => {
    createRootNodeWithName(cy, 'parent')
    createChildNodeWithName(cy, 'child')

    cy.all(
      findElementWithText(cy, 'parent'),
      findElementWithText(cy, 'child'),
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

  it('link anchors on edge of each node', () => {
    createRootNodeWithName(cy, 'parent')
    createChildNodeWithName(cy, 'child')

    cy.all(
      findElementWithText(cy, 'parent'),
      findElementWithText(cy, 'child'),
      findAllLinkAnchors(cy)
    )
      .then(([[Parent], [Child], [AnchorA, AnchorB]]) => {
        const nodeRects = DOM.getBoundingClientRects([Parent, Child])
        const anchorRects = DOM.getBoundingClientRects([AnchorA, AnchorB])
        return DOM.pairTouchingRects(anchorRects, nodeRects)
      })
      .then((rectPairs) => {
        rectPairs.forEach(([anchorOffset, nodeOffset]) =>
          expectAnchorOnNodeEdge(anchorOffset, nodeOffset)
        )
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
