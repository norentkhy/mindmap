import React from 'react'
import {
  Actions,
  MainView,
  ModelProvider,
  Tabs,
} from './components'
import useModel from '~mindmap/hooks/useModel'

export default function MindMap({ logResize, useThisResizeObserver }) {
  return (
    <Providers
      logResize={logResize}
      useThisResizeObserver={useThisResizeObserver}
    >
      <StateFulTabs />
      <Actions />
      <StatefulMainView />
    </Providers>
  )
}

function StatefulMainView() {
  const model = useModel()
  const { nodes, createRootNode } = model

  return <MainView nodes={nodes} createNode={createRootNode} />
}

function StateFulTabs() {
  const model = useModel()
  const {
    tabs,
    do: { createTab },
  } = model

  return <Tabs tabs={tabs} createTab={createTab} />
}

function Providers({ children, logResize, useThisResizeObserver }) {
  return (
    <ModelProvider
      logResize={logResize}
      useThisResizeObserver={useThisResizeObserver}
    >
      {children}
    </ModelProvider>
  )
}
