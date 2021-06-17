import { Nodes, Geometry } from '~mindmap/data-structures'

export default function computeLinksToRender({ nodeIds, nodes }) {
  const childParentPairs = nodeIds.flatMap((nodeId) =>
    Nodes.getArrayChildLinksOf(nodes, nodeId)
  )
  const childLinks = childParentPairs
    .map(composeIdFromParentAndChild)
    .map((link) => computeAnchors(nodes, link))

  return [...childLinks]
}

function composeIdFromParentAndChild(link) {
  return { ...link, id: `${link.parentId} -> ${link.childId}` }
}

function computeAnchors(nodes, link) {
  const anchorOffset = computeAnchorOffsets(nodes, link)

  return {
    ...link,
    start: {
      id: `start at ${link.parentId}`,
      linkedToNodeId: link.parentId,
      centerOffset: anchorOffset.parent,
    },
    end: {
      id: `start at ${link.childId}`,
      linkedToNodeId: link.childId,
      centerOffset: anchorOffset.child,
    },
  }
}

function computeAnchorOffsets(nodes, link) {
  const [parent, child] = [link.parentId, link.childId].map((id) => ({
    centerOffset: Nodes.getCenterOffset(nodes, id),
    size: Nodes.getSize(nodes, id),
  }))
  const angle = calculateAngle(parent.centerOffset, child.centerOffset)

  return {
    parent: computeAnchorOffsetOnEdge(parent, angle),
    child: computeAnchorOffsetOnEdge(child, Geometry.invertAngle(angle)),
  }
}

function computeAnchorOffsetOnEdge(nodeDimensions, angle) {
  const { centerOffset, size } = nodeDimensions
  if (!size) return centerOffset

  return Geometry.computePointOnEdge(angle, size, centerOffset)
}

function calculateAngle(startOffset, endOffset) {
  const dx = endOffset.left - startOffset.left
  const dy = endOffset.top - startOffset.top
  return Math.atan2(dy, dx)
}
