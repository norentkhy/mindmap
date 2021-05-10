export function reduceObject(obj, init, reduce) {
  const entries = Object.entries(obj)
  return entries.reduce(reduce, init)
}

export function mapObject(obj, map) {
  const entries = Object.entries(obj)
  return entries.reduce(
    (draft, [key, value]) => ({ ...draft, [key]: map(value) }),
    {}
  )
}
export function mapMultipleArrays(arrayOfArrays, map) {
  const minimumLength = arrayOfArrays.reduce(
    reduceToMinimumLength,
    arrayOfArrays[0].length
  )

  const mappedValues = Array.from({ length: minimumLength })
  for (let i = 0; i < minimumLength; i++) {
    const values = arrayOfArrays.map((arr) => arr[i])
    mappedValues[i] = map(...values)
  }

  return mappedValues
}
export function reduceToMinimumLength(minimumLength, arr) {
  const { length } = arr
  if (minimumLength > length) return length
  return minimumLength
}

export function repeat(n, fn) {
  for (let i = 0; i < n; i++) fn()
}