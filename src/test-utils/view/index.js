import { query } from './queries'
import { expectations } from './expectations'
import { waitForExpectation } from './wait-for-expectations'
import { action } from './actions'
import { renderView, debugView } from './render'

export const view = {
  debug: debugView,
  render: renderView,
  query,
  action,
  expect: expectations,
  waitFor: waitForExpectation,
}
