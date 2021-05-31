import { Tabs } from '~mindmap/data-structures'

export default function computeTabsToRender({
  tabsNew,
  actions,
}) {
  const bindIdToTabActions = prepareTabIdBindings(actions)

  return Tabs.getArrayIdName(tabsNew).map(([id, name]) => ({
    id,
    name,
    selected: Tab.isSelected(tabsNew),
    renaming: Tab.isRenaming(tabsNew),
    do: bindIdToTabActions(id)
  }))
}

function prepareTabIdBindings({
  selectTab,
  initiateRenameTab,
  finishRenameTab,
}) {
  return (id) => ({
    select: () => selectTab(id),
    editName: () => initiateRenameTab(id),
    rename: (newName) => finishRenameTab(id, newName),
  })
}