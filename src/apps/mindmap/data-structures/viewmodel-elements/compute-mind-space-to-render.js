import { Nodes } from '~mindmap/data-structures'
import {
  computeNodesToRender,
  computeLinksToRender,
  computeTabsToRender,
  computeGeneralActions,
} from './index'

export default function computeMindSpaceToRender({
  nodes,
  actions,
  useSizeObserver,
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
      useSizeObserver
    }),
  }
}
