import React from 'react'
import styled from 'styled-components'

export default function InteractiveActions({ viewmodel }) {
  const {
    context: contextButtons,
    time: timeButtons,
    navigation: navigationButtons,
  } = viewmodel.buttons

  return (
    <FlexColumnCentered aria-label="interactive actions console">
      <ButtonGroup buttonModels={contextButtons} />
      <ButtonGroup buttonModels={timeButtons} />
      <ButtonGroup buttonModels={navigationButtons} />
    </FlexColumnCentered>
  )
}

function ButtonGroup({ buttonModels }) {
  return (
    <FlexColumnPadded>
      {buttonModels?.map((model) => (
        <Button model={model} key={model.id} />
      ))}
    </FlexColumnPadded>
  )
}

function Button({ model }) {
  return (
    <button
      disabled={model.disabled}
      onClick={model.callback}
      aria-label={model.label}
    >
      {model.text}
    </button>
  )
}

const FlexColumnPadded = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.4em 0em;
`

const FlexColumnCentered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
