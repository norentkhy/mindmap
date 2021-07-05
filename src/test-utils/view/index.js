import { query } from './queries'
import { expectations } from './expectations'
import { waitForExpectation, getWaitForOptions } from './wait-for-expectations'
import { action } from './actions'
import { renderView, debugView, describe, test, expect } from '../dependencies'

const view = {
  debug: debugView,
  render: renderView,
  query,
  action,
  expect: expectations,
  waitFor: waitForExpectation,
  ...action
}
export { getWaitForOptions, view, describe, test, expect }
