import { InteractiveActions } from '~mindmap/components'
import { view, createMockFn, addIdTo } from '~mindmap/test-utilities'
import React from 'react'

test('initial blank mindspace', () => {
  const viewmodel = {
    buttons: {
      context: [createButton('createNode')],
      time: createTimeButtons(),
    },
  }
  view.render(<InteractiveActions viewmodel={viewmodel} />)

  const buttons = [...viewmodel.buttons.context, ...viewmodel.buttons.time]
  buttons.forEach((button) => {
    expect(button.callback).toBeCalledTimes(0)
    view.clickOn.label(button.label)
    expect(button.callback).toBeCalledTimes(1)
  })
})

test('node created: inputting node text', () => {
  const createChildButton = createButton('createChild', { disabled: true })
  const submitTextButton = createButton('submitText')
  const viewmodel = {
    notifications: [addIdTo({ text: 'inputting text' })],
    buttons: {
      context: [createChildButton, submitTextButton],
      time: createTimeButtons(),
    },
  }
  view.render(<InteractiveActions viewmodel={viewmodel} />)

  view.clickOn.label(createChildButton.label)
  expect(createChildButton.callback).toBeCalledTimes(0)

  view.clickOn.label(submitTextButton.label)
  expect(submitTextButton.callback).toBeCalledTimes(1)
})

test('node selected', () => {
  const navigationButtons = createNavigationButtons()
  const createChildButton = createButton('createChild')
  const editTextButton = createButton('editText')
  const viewmodel = {
    buttons: {
      navigation: navigationButtons,
      context: [createChildButton, editTextButton],
      time: createTimeButtons(),
    },
  }
  view.render(<InteractiveActions viewmodel={viewmodel} />)

  navigationButtons.forEach(button => {
    expect(button.callback).toBeCalledTimes(0)
    view.clickOn.label(button.label)
    expect(button.callback).toBeCalledTimes(1)
  })
})

function createNavigationButtons() {
  const names = ['left', 'right', 'up', 'down']
  return names.map(createButton)
}

function createTimeButtons() {
  const names = ['undo', 'redo']
  return names.map(createButton)
}

const buttonInfo = {
  undo: { text: 'undo', label: 'undo' },
  redo: { text: 'redo', label: 'redo' },
  createNode: { text: 'create node', label: 'create node' },
  createChild: { text: 'create child', label: 'create child' },
  submitText: { text: 'submit this text', label: 'submit this text' },
  left: { text: 'left', label: 'navigateLeft' },
  right: { text: 'right', label: 'navigateRight' },
  up: { text: 'up', label: 'navigateUp' },
  down: { text: 'down', label: 'navigatedown' },
}

function createButton(name, options = {}) {
  if (!name in buttonInfo) throw new Error('unknown button')
  return addIdTo({ ...buttonInfo[name], callback: createMockFn(), ...options })
}
