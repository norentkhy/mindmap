import {
  computeNodesToRender,
  computeTabsToRender,
  computeGeneralActions,
} from './viewmodel-elements'

export default {
  compute,
}

function compute(state, actions, hooks) {
  return {
    tabs: computeTabsToRender({
      tabs: state.tabs,
      actions,
    }),
    nodes: computeNodesToRender({
      nodes: state.nodes,
      actions,
      useSizeObserver: hooks.useSizeObserver,
    }),
    do: computeGeneralActions(actions),
  }
}
