import { mapObject } from 'src/utils/FunctionalProgramming'
import {
  describe,
  expect,
  expectAnId,
  renderViewmodel,
  act,
} from 'src/test-utils/viewmodel'

const expectButton = createButtonExpectations({
  undo: { text: 'undo', label: 'undo' },
  redo: { text: 'redo', label: 'redo' },
  createNode: { text: 'create root node', label: 'create root node' },
  createChild: { text: 'create child node', label: 'create child node' },
  submitText: { text: 'submit text', label: 'submit text' },
  navigateLeft: { text: 'navigate left', label: 'navigate left' },
  navigateRight: { text: 'navigate right', label: 'navigate right' },
  navigateUp: { text: 'navigate up', label: 'navigate up' },
  navigateDown: { text: 'navigate down', label: 'navigate down' },
})

const expectNavigationButtons = (options) => {
  const names = ['navigateLeft', 'navigateRight', 'navigateUp', 'navigateDown']
  return names.map((name) =>
    expectButton[name]({ disabled: !!options?.disabled })
  )
}

describe('interactive actions state', () => {
  test('initial', () => {
    const vm = renderViewmodel()
    expect(vm.actionPanel).toEqual({
      buttons: {
        navigation: expectNavigationButtons({ disabled: true }),
        context: [
          expectButton.createNode(),
          expectButton.createChild({ disabled: true }),
          expectButton.submitText({ disabled: true }),
        ],
        time: [
          expectButton.undo({ disabled: true }),
          expectButton.redo({ disabled: true }),
        ],
      },
    })
  })

  test('node created', () => {
    const vm = renderViewmodel()
    const createNodeButton = getButton(vm, { text: 'create root node' })
    act(() => createNodeButton.callback())
    expect(vm.actionPanel).toEqual({
      buttons: {
        navigation: expectNavigationButtons({ disabled: true }),
        context: [
          expectButton.createNode(),
          expectButton.createChild({ disabled: true }),
          expectButton.submitText({ disabled: false }),
        ],
        time: [
          expectButton.undo({ disabled: false }),
          expectButton.redo({ disabled: true }),
        ],
      },
    })
  })

  test('node text given', () => {
    const vm = renderViewmodel()
    const createNodeButton = getButton(vm, { text: 'create root node' })
    act(() => createNodeButton.callback())
    act(() => vm.nodes[0].do.changeNodeText('changed node text'))
    expect(vm.actionPanel).toEqual({
      buttons: {
        navigation: expectNavigationButtons({ disabled: true }),
        context: [
          expectButton.createNode(),
          expectButton.createChild({ disabled: false }),
          expectButton.submitText({ disabled: true }),
        ],
        time: [
          expectButton.undo({ disabled: false }),
          expectButton.redo({ disabled: true }),
        ],
      },
    })
  })
})

function getButton(vm, { text }) {
  if (text)
    return vm.actionPanel.buttons.context.find((btn) => btn.text === text)
}

function createButtonExpectations(specs) {
  return mapObject(specs, (spec) => (extraSpec) => ({
    ...spec,
    id: expectAnId(),
    callback: expect.any(Function),
    ...extraSpec,
  }))
}
