import { hot } from 'react-hot-loader'
import React, { useContext } from 'react'
import styled from 'styled-components'

import { withAppContext, AppContext } from './components'

const App = withAppContext(AppWithoutContext)

function AppWithoutContext() {
  const { appState } = useContext(AppContext)
  const { onMoveEffects } = appState

  return <AppContainer onMouseMove={triggerOnMoveEffects}></AppContainer>

  function triggerOnMoveEffects() {
    onMoveEffects.forEach((effect) => {
      effect?.()
    })
  }
}

const absoluteFullSizeStyle = `
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const AppContainer = styled.div`
  ${absoluteFullSizeStyle}
  height: 100%;
  font-size: 16px;
  font-family: Arial;

  /* Descendant-scoped global style */
  & * {
    box-sizing: border-box;
  }
`

export default hot(module)(App)
