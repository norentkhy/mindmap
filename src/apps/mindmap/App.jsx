import React from 'react'
import {
  Actions,
  MainView,
  ModelProvider,
  Tabs,
  TabsProvider,
} from './components'
import useModel from '~mindmap/hooks/useModel'

export default function MindMap({ logResize, useThisResizeObserver }) {
  return (
    <Providers
      logResize={logResize}
      useThisResizeObserver={useThisResizeObserver}
    >
      <Tabs />
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

function Providers({ children, logResize, useThisResizeObserver }) {
  return (
    <ModelProvider
      logResize={logResize}
      useThisResizeObserver={useThisResizeObserver}
    >
      <TabsProvider>{children}</TabsProvider>
    </ModelProvider>
  )
}
