import { ViewmodelProvider, withViewmodel } from '~/components/index'
import { viewmodel } from '~/test-utils/index'
import React from 'react'

export function MindMapApp(
  { useViewmodel = useStandardViewmodel } = {
    useViewmodel: useStandardViewmodel,
  }
) {
  return (
    <ViewmodelProvider useViewmodel={useViewmodel}>
      <div>
        <Tabs />
      </div>
    </ViewmodelProvider>
  )
}
const useStandardViewmodel = viewmodel.createMock.hook()

const Tabs = withViewmodel(TabsUnlinked, (viewmodel) => ({
  tabs: viewmodel.state.tabs,
  selectTab: viewmodel.action.selectTab,
}))

function TabsUnlinked({ tabs, selectTab }) {
  return (
    <div aria-label="Tabs">
      {tabs.map((tab) => (
        <Tab tab={tab} key={tab.id} selectThisTab={selectTab} />
      ))}
    </div>
  )
}

function Tab({ tab, selectThisTab }) {
  return <button aria-label="Tab" onClick={selectThisTab}>{tab.name}</button>
}
