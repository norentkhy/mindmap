import { renderHook, act } from '@testing-library/react-hooks'
import { useTime } from '~mindmap/hooks/useTime'
import { describe, test, expect } from '@jest/globals'

describe('useTime', () => {
  const initialPresent = 0
  const extraTimeInstances = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const timeInstances = [initialPresent, ...extraTimeInstances]

  test('hook rendering', () => {
    const { result } = renderUseTime(initialPresent)
    const timeline = getTimeline(result)
    expect(timeline).toEqual({
      pasts: [],
      present: 0,
      futures: [],
    })
  })

  test('add to target state timeline', () => {
    const { result } = renderUseTime(initialPresent)

    extraTimeInstances.forEach((desiredTimeInstance, timelineIndex) => {
      insertTimeInstance({ result, timeInstance: desiredTimeInstance })
      const timeline = getTimeline(result)

      expect(timeline).toEqual({
        pasts: timeInstances.slice(0, timelineIndex + 1),
        present: desiredTimeInstance,
        futures: [],
      })
    })
  })

  test('go back in target timeline', () => {
    const { result } = renderUseTime(initialPresent)

    insertTimeInstances({ result, extraTimeInstances })

    goBack({ result })
    expect(getTimeline(result)).toEqual({
      pasts: [0, 1, 2, 3, 4, 5, 6, 7],
      present: 8,
      futures: [9],
    })

    goBack({ result, distance: 1 })
    expect(getTimeline(result)).toEqual({
      pasts: [0, 1, 2, 3, 4, 5, 6],
      present: 7,
      futures: [8, 9],
    })

    goBack({ result, distance: 2 })
    expect(getTimeline(result)).toEqual({
      pasts: [0, 1, 2, 3, 4],
      present: 5,
      futures: [6, 7, 8, 9],
    })

    goBack({ result, distance: 3 })
    expect(getTimeline(result)).toEqual({
      pasts: [0, 1],
      present: 2,
      futures: [3, 4, 5, 6, 7, 8, 9],
    })

    goBack({ result, distance: 4 })
    expect(getTimeline(result)).toEqual({
      pasts: [],
      present: 0,
      futures: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    })
  })

  test('go forward in target timeline', () => {
    const { result } = renderUseTime(initialPresent)

    insertTimeInstances({ result, extraTimeInstances })
    goBackToTheStart(result)

    goForward({ result })
    expect(getTimeline(result)).toMatchObject({
      pasts: [0],
      present: 1,
      futures: [2, 3, 4, 5, 6, 7, 8, 9],
    })

    goForward({ result, distance: 1 })
    expect(getTimeline(result)).toMatchObject({
      pasts: [0, 1],
      present: 2,
      futures: [3, 4, 5, 6, 7, 8, 9],
    })

    goForward({ result, distance: 2 })
    expect(getTimeline(result)).toMatchObject({
      pasts: [0, 1, 2, 3],
      present: 4,
      futures: [5, 6, 7, 8, 9],
    })

    goForward({ result, distance: 3 })
    expect(getTimeline(result)).toMatchObject({
      pasts: [0, 1, 2, 3, 4, 5, 6],
      present: 7,
      futures: [8, 9],
    })

    goForward({ result, distance: 4 })
    expect(getTimeline(result)).toMatchObject({
      pasts: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      present: 9,
      futures: [],
    })
  })

  test('go back and insert time instance', () => {
    const { result } = renderUseTime(initialPresent)

    insertTimeInstances({ result, extraTimeInstances })
    goBack({ result, distance: 5 })

    const timeInstance = 'a new future'
    insertTimeInstance({ result, timeInstance })

    expect(getTimeline(result)).toMatchObject({
      pasts: [0, 1, 2, 3, 4],
      present: timeInstance,
      futures: [],
    })
  })
})

function renderUseTime(initialPresent) {
  return renderHook(() => useTime(initialPresent))
}

function goForward({ result, distance }) {
  act(() => result.current[3](distance))
}

function goBack({ result, distance }) {
  act(() => result.current[2](distance))
}

function goBackToTheStart(result) {
  const { pasts } = getTimeline(result)
  goBack({ result, distance: pasts.length })
}

function getTimeline(result) {
  return result.current[0]
}

function insertTimeInstance({ result, timeInstance }) {
  act(() => result.current[1](() => timeInstance))
}

function insertTimeInstances({ result, extraTimeInstances }) {
  extraTimeInstances.forEach((timeInstance) => {
    insertTimeInstance({ result, timeInstance })
  })
}
