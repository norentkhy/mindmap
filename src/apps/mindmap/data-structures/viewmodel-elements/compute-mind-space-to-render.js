import { Nodes } from '~mindmap/data-structures'
import { computeNodesToRender, computeLinksToRender } from './index'

export default function computeMindSpaceToRender({
  nodes,
  actions,
  hooks: { useSizeObserver },
}) {
  const visibleNodeIds = Nodes.getArrayVisibleIds(nodes)

  return {
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
