import React from 'react'
import {
  Actions,
  MainView,
  ModelProvider,
  Tabs,
  TabsProvider,
} from './components'

export default function MindMap({ logResize, useThisResizeObserver }) {
  return (
    <Providers
      logResize={logResize}
      useThisResizeObserver={useThisResizeObserver}
    >
      <Tabs />
      <Actions />
      <MainView />
    </Providers>
  )
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
