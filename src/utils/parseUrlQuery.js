function parseUrlQuery(url) {
  const stringQuery = url.split('?')[1]

  if (stringQuery) {
    const urlQueries = stringQuery.split('&')

    const queries = urlQueries.reduce((parameters, query) => {
      const [parameter, argument] = query.split('=')
      return { ...parameters, [parameter]: argument }
    }, {})

    return queries
  } else {
    return {}
  }
}

export default parseUrlQuery
