import {
  computeInteractiveActions,
  computeMindSpaceToRender,
  computeTabsToRender,
  computeGeneralActions,
} from './viewmodel-elements'

export default {
  compute,
  update,
}

function compute(state, actions, hooks, timeline) {
  const { handleNodeDrop, nodes, links } = computeMindSpaceToRender({
    nodes: state.nodes,
    actions,
    hooks,
  })

  const generalActions = computeGeneralActions(actions, handleNodeDrop)

  return {
    tabs: computeTabsToRender({
      tabs: state.tabs,
      actions,
    }),
    nodes,
    links,
    actionPanel: computeInteractiveActions({
      timeline: timeline,
      nodes: state.nodes,
      actions,
    }),
    do: generalActions,
  }
}

function update(prior, state, actions, hooks, timeline) {
  const newViewmodel = compute(state, actions, hooks, timeline)
  if (!prior.viewmodel) return newViewmodel

  return mixModel(prior.viewmodel, newViewmodel)
}

function mixModel(oldModel, newModel) {
  return {
    ...newModel,
    tabs: mixObjs(oldModel.tabs, newModel.tabs, tabViewPropertyKeys),
    nodes: mixObjs(oldModel.nodes, newModel.nodes, nodeViewPropertyKeys),
  }
}

function mixObjs(oldObjs, newObjs, keys) {
  const oldObjsMap = getIdMap(oldObjs)
  const newObjsMap = getIdMap(newObjs)

  const newIds = newObjs.map((obj) => obj.id)

  const unchangedIds = newIds
    .filter((id) => oldObjsMap.has(id))
    .map((id) => [oldObjsMap.get(id), newObjsMap.get(id)])
    .filter(([oldObj, newObj]) => !isChangedObj(oldObj, newObj, keys))

  return newIds.map((id) => {
    if (unchangedIds.includes(id)) return oldObjsMap.get(id)
    return newObjsMap.get(id)
  })
}

function getIdMap(objects) {
  return new Map(objects.map((object) => [object.id, object]))
}

function isChangedObj(oldObj, newObj, keys) {
  return keys.reduce((isModified, key) => {
    if (isModified) return true
    return oldObj[key] !== newObj[key]
  }, false)
}

const tabViewPropertyKeys = ['id', 'name', 'selected', 'renaming']
const nodeViewPropertyKeys = ['id', 'text', 'editing', 'folded', 'focused']
