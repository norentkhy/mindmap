import React from 'react'
import styled from 'styled-components'
import { addDecorator } from '@storybook/react'

const AppContainer = styled.div`
  height: 100%;
  font-size: 16px;
  font-family: Arial;

  /* Descendant-scoped global style */
  & * {
    box-sizing: border-box;
  }
`

addDecorator((Story) => (
  <AppContainer>
    <Story />
  </AppContainer>
))
