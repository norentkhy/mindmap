import {
  MainView,
  ModelProvider,
  Tabs,
  InteractiveActions,
  AppLayout,
} from './components'
import useModel from 'src/hooks/useModel'
import React from 'react'

export default function MindMap() {
  return (
    <AppLayout
      Provider={<ModelProvider />}
      Tabs={<StatefulTabs />}
      MainView={<StatefulMainView />}
      Actions={<StatefulInteractiveActions />}
    />
  )
}

function StatefulInteractiveActions() {
  const model = useModel()
  return <InteractiveActions viewmodel={model.actionPanel} />
}

function StatefulMainView() {
  const model = useModel()
  const {
    nodes,
    links,
    do: { createNodeOnMouse, navigate, handleNodeDrop },
  } = model

  return (
    <MainView
      nodes={nodes}
      links={links}
      createNode={createNodeOnMouse}
      navigate={navigate}
      handleNodeDrop={handleNodeDrop}
    />
  )
}

function StatefulTabs() {
  const model = useModel()
  const {
    tabs,
    do: { createTab },
  } = model

  return <Tabs tabs={tabs} createTab={createTab} />
}
