export function update(obj, update) {
  return { ...obj, ...update }
}

export function modify(obj, applyModification) {
  const newObj = { ...obj }
  return applyModification(newObj)
}

export function append(arr, item) {
  return [...arr, item]
}

export function remove(arr, item) {
  return arr.filter((element) => element != item)
}

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
  for (let i = 0; i < n; i++) fn(i)
}

export function span(start, step, end) {
  if (start >= end) return []
  return [start, ...span(start + step, step, end)]
}

export function zip(arr1, arr2, applyZip = (x, y) => [x, y]) {
  let i = 0
  let zipped = []
  while (i in arr1 && i in arr2) {
    zipped[i] = applyZip(arr1[i], arr2[i])
    i++
  }
  return zipped
}

export function getAllCombinations(...thingsToCombine) {
  return thingsToCombine.reduce(combineArrayWithCombinations, [[]])
}

export function mapAllCombinations(variantsToCombine, mapCombination) {
  const allCombinations = getAllCombinations(...variantsToCombine)
  return allCombinations.map((combination) => mapCombination(combination))
}

export function combineArrayWithCombinations(combinations, array) {
  return combinations.flatMap((combination) => {
    return array.map((value) => {
      return [...combination, value]
    })
  })
}
