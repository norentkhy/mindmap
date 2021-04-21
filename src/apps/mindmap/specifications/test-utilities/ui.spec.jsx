import { expect, describe, test } from '@jest/globals'
import { ui, getWaitForOptions } from '~mindmap/test-utilities/view'
import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { mapObject } from 'utils/FunctionalProgramming'

describe('query', () => {
  test('elements with text', () => {
    const text = 'this will be queried'
    ui.renderView({ JSX: <button>{text}</button> })

    const Element = ui.query.byText(text)

    expect(Element).not.toBeNull()
    expect(Element).toBe(screen.queryByText(text))
  })
})

describe('expect', () => {
  test('element visibility', () => {
    const text = 'this is visible'
    ui.renderView({ JSX: <button>{text}</button> })

    const queryElement = () => ui.query.byText(text)
    expect(queryElement()).toBeVisible()

    ui.expect.element(queryElement).toBeVisible()
  })
})

describe('wait for', () => {
  test('implementation detail: wraps expect object', async () => {
    const expectQuery = (...args) => ({
      toBeTrue: () => expect(...args).toBe(true),
      toBeFalse: () => expect(...args).toBe(false),
      not: {
        toBeFalse: () => expect(...args).not.toBe(false),
      },
    })

    const waitForQuery = getWaitForOptions({
      getExpectOptions: expectQuery,
      structureSample: expectQuery(true),
    })

    expectQuery(true).toBeTrue()
    const promise0 = waitForQuery(true).toBeTrue()
    await waitForAndExpectPromise(promise0)

    expectQuery(false).toBeFalse()
    const promise1 = waitForQuery(false).toBeFalse()
    await waitForAndExpectPromise(promise1)

    expectQuery(true).not.toBeFalse()
    const promise2 = waitForQuery(true).not.toBeFalse()
    await waitForAndExpectPromise(promise2)
  })
})

async function waitForAndExpectPromise(promise) {
  expect(promise).toHaveProperty('then')
  expect(promise).toHaveProperty('catch')
  expect(promise).toHaveProperty('finally')

  return await promise
}