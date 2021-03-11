import produce from 'immer'
import { useReducer } from 'react'

export function useTime(
  initialTimeline = { pasts: [], present: null, futures: [] }
) {
  const [timeline, dispatch] = useReducer(reduce, initialTimeline)

  return {
    timeline,
    insertIntoTimeline(timeInstance) {
      dispatch({ type: 'INSERT_INTO_TIMELINE', payload: timeInstance })
    },
    goBack(distance = 1) {
      dispatch({ type: 'GO_BACK_IN_TIMELINE', payload: distance })
    },
    goForward(distance = 1) {
      dispatch({ type: 'GO_FORWARD_IN_TIMELINE', payload: distance })
    },
  }

  function reduce(timeline, action) {
    const calculateNewState = stateTransitions[action.type]
    const newTimeline = calculateNewState(timeline, action.payload)

    return newTimeline
  }
}

const stateTransitions = {
  INSERT_INTO_TIMELINE(timeline, timeInstance) {
    return produce(timeline, (newTimeline) => {
      const { pasts, present } = newTimeline
      if (!isInitial(timeline)) pasts.push(present)
      newTimeline.present = timeInstance
      newTimeline.futures = []
    })
  },
  GO_BACK_IN_TIMELINE(timeline, distance) {
    return produce(timeline, (newTimeline) => {
      repeatFn({
        amount: Math.min(timeline.pasts.length, distance),
        fn: () => shiftPresentToFuture(newTimeline),
      })
    })

    function shiftPresentToFuture(timeline) {
      const { pasts, present, futures } = timeline

      futures.unshift(present)
      const newPresent = pasts.pop()
      timeline.present = newPresent
    }
  },
  GO_FORWARD_IN_TIMELINE(timeline, distance) {
    return produce(timeline, (newTimeline) => {
      repeatFn({
        amount: Math.min(timeline.futures.length, distance),
        fn: () => shiftFutureToPresent(newTimeline),
      })
    })

    function shiftFutureToPresent(timeline) {
      const { pasts, present, futures } = timeline

      pasts.push(present)
      const newPresent = futures.shift()
      timeline.present = newPresent
    }
  },
}

function isInitial({ pasts, present, futures }) {
  return present === null && !pasts.length && !futures.length
}

function repeatFn({ amount, fn }) {
  for (let i = 0; i < amount; i++) {
    fn()
  }
}
