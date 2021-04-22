import useModel from '~mindmap/hooks/useModel'
import { ModelProvider } from '~mindmap/components'
import { view } from '~mindmap/test-utilities/view'
import React from 'react'

test('normal use case', () => {
  view.render({
    JSX: (
      <ModelProvider>
        <ExpectHookToGiveState />
      </ModelProvider>
    ),
  })
})

test('test use case', () => {
  view.render({
    injectMockModelIntoJSX: ({ useMock }) => (
      <ExpectHookToGiveState useThisModel={useMock} />
    ),
  })
})

function ExpectHookToGiveState({ useThisModel = useModel }) {
  const model = useThisModel()
  expect(model).toHaveProperty('state')
  return <div></div>
}
