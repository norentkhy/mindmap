import { definedElementQueries, definedMultiElementQueries } from './queries'
import { getInputSelection } from 'test-utils/dom'
import { mapObject } from 'utils/FunctionalProgramming'
import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import 'jest-styled-components'

export const definedElementExpects = mapObject(
  definedElementQueries,
  expectElement
)

export const definedMultiElementExpects = mapObject(
  definedMultiElementQueries,
  expectElements
)

export const expectations = {
  ...definedElementExpects,
  ...definedMultiElementExpects,
  element: (queryElement) => expectElement(queryElement)(),
}

function expectElement(queryElement) {
  return (elementInfo) => {
    const Element = queryElement(elementInfo)
    const expectThisElement = expect(Element)
    return {
      toBeVisible: expectThisElement.toBeVisible,
      toHaveFocus: expectThisElement.toHaveFocus,
      toHaveTextContent: expectThisElement.toHaveTextContent,
      toHaveStyle: expectToHaveStyle(true)(Element),
      toHaveTextSelection: expectToHaveInputSelection(true)(Element),
      not: {
        toBeVisible: expectThisElement.toBeNull,
        toHaveFocus: expectThisElement.not.toHaveFocus,
        toHaveTextContent: expectThisElement.not.toHaveTextContent,
        toHaveStyle: expectToHaveStyle(false)(Element),
        toHaveTextSelection: expectToHaveInputSelection(false)(Element),
      },
    }
  }
}

function expectElements(queryElements) {
  return (elementInfo) => {
    const Elements = queryElements(elementInfo)
    return {
      toHaveTextContents(expectedTextContents) {
        const textContents = Elements.map((Element) => Element.textContent)
        expect(textContents).toMatchObject(expectedTextContents)
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
