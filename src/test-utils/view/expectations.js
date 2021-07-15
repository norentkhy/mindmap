import { query, definedElementQueries } from './queries'
import { expect, getInputSelection } from '../dependency-wrappers'
import { mapObject } from 'src/utils/FunctionalProgramming'
import 'jest-styled-components'
const queryAllUntitledTabs = query.allUntitledTabs

export const definedElementExpects = mapObject(
  definedElementQueries,
  expectElement
)

export const expectations = {
  ...definedElementExpects,
  element: (queryElement) => expectElement(queryElement)(),
  numberOf: {
    untitledTabs() {
      const UntitledTabs = queryAllUntitledTabs()
      return {
        toBe: (amount) => expect(UntitledTabs.length).toBe(amount),
      }
    },
  },
}

function expectElement(queryElement) {
  return (elementInfo) => {
    const Element = queryElement(elementInfo)
    const expectThisElement = expect(Element)
    return {
      toBeVisible: expectThisElement.toBeVisible,
      toHaveFocus: expectThisElement.toHaveFocus,
      toHaveStyle: expectToHaveStyle(true)(Element),
      toHaveTextSelection: expectToHaveInputSelection(true)(Element),
      not: {
        toBeVisible: expectThisElement.toBeNull,
        toHaveFocus: expectThisElement.not.toHaveFocus,
        toHaveStyle: expectToHaveStyle(false)(Element),
        toHaveTextSelection: expectToHaveInputSelection(false)(Element),
      },
    }
  }
}

function expectToHaveStyle(positiveExpectation) {
  return (Element) => (style) => {
    const styleEntries = Object.entries(style)
    styleEntries.forEach(expectToHaveStyleRule(positiveExpectation)(Element))
  }
}

function expectToHaveStyleRule(positiveExpectation) {
  if (positiveExpectation)
    return (Element) => (style) => expect(Element).toHaveStyleRule(...style)
  if (!positiveExpectation)
    return (Element) => (style) => expect(Element).not.toHaveStyleRule(...style)
}

function expectToHaveInputSelection(expectToBeTrue) {
  return (Element) => (expectation) => {
    const inputSelection = getInputSelection(Element)
    if (expectToBeTrue) expect(inputSelection).toBe(expectation)
    if (!expectToBeTrue) expect(inputSelection).not.toBe(expectation)
  }
}
