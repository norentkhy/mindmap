import React from 'react'
import { zip } from 'rambda'
import {
  LocationProvider,
  createHistory,
  createMemorySource,
} from '@reach/router'
import { render } from '@testing-library/react'
import useUrlParameters from './useUrlParameters'

const noParametersText = 'no parameters on this route'

describe('gets url parameters', () => {
  test('no parameters', async () => {
    const { findByText } = renderRouteQueryTester('/no-query')

    const foundResult = await findByText(noParametersText)
    expect(foundResult).toBeVisible()
  })

  test('one parameter', async () => {
    const key = 'this'
    const value = 'that'
    const { findByText } = renderRouteQueryTester(`/?${key}=${value}`)

    const expectedKeyValue = formatKeyValue([key, value])
    const foundKeyValue = await findByText(expectedKeyValue)
    expect(foundKeyValue).toBeVisible()
  })

  test('two parameters', async () => {
    const keys = ['some', 'another']
    const values = ['thing', 'thing']
    const keyValues = zip(keys, values)
    const { findByText } = renderRouteQueryTester(
      `/?${keys[0]}=${values[0]}&${keys[1]}=${values[1]}`
    )

    for (const keyValue of keyValues) {
      const expectedKeyValue = formatKeyValue(keyValue)
      const foundKeyValue = await findByText(expectedKeyValue)
      expect(foundKeyValue).toBeVisible()
    }
  })

  test('handles faulty parameters as such', async () => {
    const keys = ['some', 'another']
    const values = ['thing', 'thing']
    const { findByText } = renderRouteQueryTester(
      `/&${keys[0]}=${values[0]}&${keys[1]}=${values[1]}`
    )

    const foundResult = await findByText(noParametersText)
    expect(foundResult).toBeVisible()
  })

  test('handles character ~ - . _', async () => {
    await testCharacter('~')
    await testCharacter('-')
    await testCharacter('.')
    await testCharacter('_')
  })
})

//

async function testCharacter(character) {
  const key = `show${character}tab`
  const value = 'true'
  const { findByText } = renderRouteQueryTester(`/?${key}=${value}`)

  const expectedKeyValue = formatKeyValue([key, value])
  const foundKeyValue = await findByText(expectedKeyValue)
  expect(foundKeyValue).toBeVisible()
}

function renderRouteQueryTester(route) {
  return render(<UrlQueryTester route={route} />)
}

function UrlQueryTester({ route }) {
  const history = createHistory(createMemorySource(route))
  return (
    <LocationProvider history={history}>
      <QueryDisplay />
    </LocationProvider>
  )
}

function QueryDisplay() {
  const parameters = useUrlParameters()
  const keyValues = Object.entries(parameters)

  return (
    <ul>
      {keyValues.length === 0
        ? noParametersText
        : keyValues.map((keyValue) => (
            <li key={keyValue}>{formatKeyValue(keyValue)}</li>
          ))}
      {}
    </ul>
  )
}

function formatKeyValue([key, value]) {
  return `${key} : ${value}`
}
