import useModel from '~mindmap/hooks/useModel'
import { ModelProvider } from '~mindmap/components'
import { ui } from '~mindmap/test-utilities/view'
import React from 'react'

test('normal use case', () => {
  ui.render(
    <ModelProvider>
      <ExpectHookToGiveState />
    </ModelProvider>
  )
})

test('test use case', () => {
  const useMock = () => ({ state: 'mock' })
  ui.render(<ExpectHookToGiveState useThisModel={useMock} />)
})

function ExpectHookToGiveState({ useThisModel = useModel }) {
  const model = useThisModel()
  expect(model).toHaveProperty('state')
  return <div></div>
}
