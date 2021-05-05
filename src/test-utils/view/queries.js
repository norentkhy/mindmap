import { getFocus } from './actions'
import { screen } from '@testing-library/react'

export const definedElementQueries = {
  label: screen.queryByLabelText,
  text: screen.queryByText,
  focus: getFocus,
}

export const query = {
  ...definedElementQueries,
  allElements: queryAllElements,
}

function queryAllElements() {
  const ReactDiv = document.body.children[0]
  return queryAllChildElements(ReactDiv)
}

function queryAllChildElements(Element) {
  const ChildElements = Array.from(Element.children)
  if (!ChildElements) return []
  return [
    Element,
    ...ChildElements.flatMap((Element) => queryAllChildElements(Element)),
  ]
}