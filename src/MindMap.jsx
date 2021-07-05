import React from 'react'
import { MainView, ModelProvider, Tabs, InteractiveActions } from './components'
import useModel from 'src/hooks/useModel'
import styled from 'styled-components'

export default function MindMap() {
  return (
    <AppContainer>
      <Providers>
        <FlexColumnFullHeight>
          <StatefulTabs />
          <FlexRowFullHeight>
            <StatefulMainView />
            <StatefulInteractiveActions />
          </FlexRowFullHeight>
        </FlexColumnFullHeight>
      </Providers>
    </AppContainer>
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

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  font-size: 16px;
  font-family: Arial;

  & * {
    box-sizing: border-box;
  }
`
