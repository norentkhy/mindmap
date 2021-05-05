import { render, screen } from '@testing-library/react'
import React from 'react'

const debugView = screen.debug

export { renderView, debugView }

function renderView(ViewElement, options) {
  if (isReact(ViewElement)) return renderReact(ViewElement, options)

  throw new Error('unknown view' + '\n' + `${ViewElement}`)
}

function renderReact(ViewElement, options) {
  return render(ViewElement, options)
}

function isReact(ViewElement) {
  const key = '$$typeof'
  const symbolReactElement = ReactExample()[key]
  return ViewElement[key] === symbolReactElement
}

function ReactExample() {
  return <div>this is used to extract Symbol(react.element)</div>
}
