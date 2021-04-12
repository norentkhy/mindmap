import React from 'react'
import { Actions } from './components/Actions/Actions'
import { MainView } from './components/MainView/MainView'
import { ProjectProvider } from './components/Contexts/ProjectContext'
import { Tabs } from './components/Tabs/Tabs'
import { TabsProvider } from './components/Tabs/TabsContext'

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
    <ProjectProvider
      logResize={logResize}
      useThisResizeObserver={useThisResizeObserver}
    >
      <TabsProvider>{children}</TabsProvider>
    </ProjectProvider>
  )
}
