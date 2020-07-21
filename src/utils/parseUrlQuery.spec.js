import parseUrlQuery from './parseUrlQuery'

describe('parses parameters from given url', () => {
  test('can match empty object', () => {
    expect({}).toEqual({})
    expect({ some: 'thing' }).not.toEqual({})
  })

  test('no parameters given', () => {
    const parameters = parseUrlQuery('https://someurl.com')
    expect(parameters).toEqual({})
  })

  test('extracts 1 parameter', () => {
    const parameters = parseUrlQuery('https://someurl.com?tab=chat')
    expect(parameters).toEqual({ tab: 'chat' })
  })

  test('extracts 2 parameters', () => {
    const parameters = parseUrlQuery('https://somerul.com?tab=chat&show=login')
    expect(parameters).toEqual({ tab: 'chat', show: 'login' })
  })

  test('can take empty arguments', () => {
    const parameters = parseUrlQuery('https://someurl.com?meditate=&happy=')
    expect(parameters).toEqual({ meditate: '', happy: '' })
  })

  test('does not extract query unless ? is present', () => {
    const parameters = parseUrlQuery('https://somerul.com&tab=chat&show=login')
    expect(parameters).toEqual({})
  })

  test('can handle ~ - . _ characters', () => {
    testCharacter('~')
    testCharacter('-')
    testCharacter('.')
    testCharacter('_')
  })
})

function testCharacter(character) {
  const parameters = parseUrlQuery(
    `https://anotherurl.com?tab=chat&tab${character}expand=true`
  )
  expect(parameters).toEqual({
    tab: 'chat',
    [`tab${character}expand`]: 'true',
  })
}
