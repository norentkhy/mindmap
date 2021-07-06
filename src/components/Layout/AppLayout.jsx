import React from 'react'
import styled from 'styled-components'

export default function AppLayout({ Provider, Tabs, MainView, Actions }) {
  return (
    <AppContainer>
      {React.cloneElement(Provider, {}, [
        <FlexColumnFullHeight key="a warning appears without this key">
          {Tabs}
          <FlexRowFullHeight>
            <FlexGrow>{MainView}</FlexGrow>
            {Actions}
          </FlexRowFullHeight>
        </FlexColumnFullHeight>,
      ])}
    </AppContainer>
  )
}

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  font-size: 16px;
  font-family: Arial;

  & * {
    box-sizing: border-box;
  }
`

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

const FlexGrow = styled.div`
  flex-grow: 1;
`
