import { Nodes, Geometry } from '~mindmap/data-structures'

export default function computeLinksToRender({
  nodeIds,
  nodes,
}) {
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
  const parent = {
    centerOffset: Nodes.getCenterOffset(nodes, link.parentId),
    size: Nodes.getSize(nodes, link.parentId),
  }

  const child = {
    centerOffset: Nodes.getCenterOffset(nodes, link.childId),
    size: Nodes.getSize(nodes, link.childId),
  }

  const direction = determineDirection(parent.centerOffset, child.centerOffset)

  return {
    parent: computeAnchorOffsetOnEdge(parent, direction),
    child: computeAnchorOffsetOnEdge(child, opposite[direction]),
  }
}

function computeAnchorOffsetOnEdge(nodeDimensions, direction) {
  const { centerOffset, size } = nodeDimensions
  if (!size) return centerOffset

  return {
    left:
      centerOffset.left +
      -((direction === 'left') * (1 / 2) * size.width) +
      +((direction === 'right') * (1 / 2) * size.width),
    top:
      centerOffset.top +
      -((direction === 'down') * (1 / 2) * size.height) +
      +((direction === 'up') * (1 / 2) * size.height),
  }
}

const opposite = {
  left: 'right',
  right: 'left',
  up: 'down',
  down: 'up',
}

function determineDirection(startOffset, endOffset) {
  const dx = endOffset.left - startOffset.left
  const dy = endOffset.top - startOffset.top
  const angle = Math.atan2(dy, dx)

  if (Geometry.isInBottomQuadrant(angle)) return 'down'
  if (Geometry.isInTopQuadrant(angle)) return 'up'
  if (Geometry.isInLeftQuadrant(angle)) return 'left'
  if (Geometry.isInRightQuadrant(angle)) return 'right'

  throw new Error(`unexpected angle: ${angle}`)
}
