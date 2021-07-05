import { Tabs } from 'src/data-structures'

export default function computeTabsToRender({ tabs, actions }) {
  const bindIdToTabActions = prepareTabIdBindings(actions)

  return Tabs.getArrayIdName(tabs).map(([id, name]) => ({
    id,
    name,
    selected: Tabs.isSelected(tabs, id),
    renaming: Tabs.isRenaming(tabs, id),
    do: bindIdToTabActions(id),
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
