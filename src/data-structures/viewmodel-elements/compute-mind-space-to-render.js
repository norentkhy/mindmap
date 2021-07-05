import { Nodes } from 'src/data-structures'
import { computeNodesToRender, computeLinksToRender } from './index'
import { computeCenterOffset } from './mouse-computations'

export default function computeMindSpaceToRender({
  nodes,
  actions,
  hooks: { useSizeObserver },
}) {
  const visibleNodeIds = Nodes.getArrayVisibleIds(nodes)

  return {
    handleNodeDrop: (e, NodeSpace) =>
      actions.finalizeMoveNode(computeCenterOffset(e, NodeSpace)),
    nodes: computeNodesToRender({
      ids: visibleNodeIds,
      nodes,
      actions,
      useSizeObserver,
    }),
    links: computeLinksToRender({
      nodeIds: visibleNodeIds,
      nodes,
      actions,
      useSizeObserver,
    }),
  }
}
