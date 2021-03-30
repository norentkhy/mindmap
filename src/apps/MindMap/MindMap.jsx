import React from 'react'
import { Actions } from './Actions/Actions'
import { MainView } from './MainView/MainView'
import { ProjectProvider } from './Contexts/ProjectContext'
import { Tabs } from './Tabs/Tabs'
import { TabsProvider } from './Tabs/TabsContext'

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
