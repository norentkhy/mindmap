import useModel from '~mindmap/hooks/useModel'
import { ModelProvider } from '~mindmap/components/Model'
import { render } from '@testing-library/react'
import React from 'react'

test('normal use case', () => {
  render(
    <ModelProvider>
      <ExpectHookToGiveState />
    </ModelProvider>
  )
})

test('test use case', () => {
  const useMock = () => ({ state: 'mock' })
  render(<ExpectHookToGiveState useThisModel={useMock} />)
})

function ExpectHookToGiveState({ useThisModel = useModel }) {
  const model = useThisModel()
  expect(model).toHaveProperty('state')
  return <div></div>
}
