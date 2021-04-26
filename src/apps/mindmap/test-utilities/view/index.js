import { query } from './queries'
import { expectations } from './expectations'
import { waitForExpectation, getWaitForOptions } from './wait-for-expectations'
import { action } from './actions'
import { renderView, debugView } from '../dependencies'

const view = {
  debug: debugView ,
  render: renderView,
  query,
  action,
  expect: expectations,
  waitFor: waitForExpectation,
}
export { getWaitForOptions, view }
