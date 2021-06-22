import React from 'react'
import { MainView, ModelProvider, Tabs, InteractiveActions } from './components'
import useModel from '~mindmap/hooks/useModel'
import styled from 'styled-components'

export default function MindMap() {
  return (
    <Providers>
      <FlexColumnFullHeight>
        <StatefulTabs />
        <FlexRowFullHeight>
          <StatefulMainView />
          <StatefulInteractiveActions />
        </FlexRowFullHeight>
      </FlexColumnFullHeight>
    </Providers>
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
    do: { createNodeOnMouse, navigate },
  } = model

  return (
    <MainView
      nodes={nodes}
      links={links}
      createNode={createNodeOnMouse}
      navigate={navigate}
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

function Providers({ children }) {
  return <ModelProvider>{children}</ModelProvider>
}

const FlexColumnFullHeight = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const FlexRowFullHeight = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`
