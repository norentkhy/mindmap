export function mapObject(obj, map) {
  const entries = Object.entries(obj)
  const mappedObj = {}
  for (const [key, value] of entries) mappedObj[key] = map(value)

  return mappedObj
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
