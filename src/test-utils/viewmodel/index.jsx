import { renderViewmodel, renderViewmodelValidation } from './render'
import { expectations } from './expectations'
import { createMocks } from './create-mocks'

export const viewmodel = {
  render: renderViewmodel,
  renderValidation: renderViewmodelValidation,
  createMock: createMocks,
  expect: expectations,
}
