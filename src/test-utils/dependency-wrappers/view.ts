import {
  Matcher,
  MatcherOptions as Options,
  render,
  screen,
} from '@testing-library/react'
import { getFocused } from '../dom'

export { waitFor } from '@testing-library/react'
export const debugView = screen.debug
export const renderView = render

type queryType = keyof typeof queryDict
type queryType3Args = keyof typeof testingLibrary.queryDict

export function queryElement(
  type: queryType3Args,
  matcher: Matcher,
  options?: Options
): HTMLElement | null
export function queryElement(type: 'focused'): Element

export function queryElement(
  type: queryType,
  matcher?: Matcher,
  options?: Options
) {
  const query = queryDict[type]
  if (matcher === undefined) return query()
  return query(matcher, options)
}

export function queryElements(
  type: queryType,
  matcher: Matcher,
  options?: Options
) {
  const query = queryAllDict[type]
  return query(matcher, options)
}

const testingLibrary = {
  queryDict: {
    text: screen.queryByText,
    label: screen.queryByLabelText,
    role: screen.queryByRole,
  },
  queryAllDict: {
    text: screen.queryAllByText,
    label: screen.queryAllByLabelText,
    role: screen.queryAllByRole,
  },
}

const queryDict = {
  ...testingLibrary.queryDict,
  focused: getFocused,
}

const queryAllDict = testingLibrary.queryAllDict
