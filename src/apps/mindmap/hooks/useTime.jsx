import { Timeline } from '~mindmap/data-structures'
import { useState } from 'react'

const initialTimeline = { pasts: [], present: null, futures: [] }

export function useTime(initialPresent = null) {
  const [timeline, setTimeline] = useState({
    ...initialTimeline,
    present: initialPresent,
  })

  const actions = bindActions(setTimeline)

  return [timeline, ...Object.values(actions)]
}

function bindActions(setTimeline) {
  return {
    registerNew: bindAddToTimeline(setTimeline),
    undo: bindUndo(setTimeline),
    redo: bindRedo(setTimeline),
  }
}

function bindAddToTimeline(setTimeline) {
  return (newPresent) =>
    setTimeline((timeline) => Timeline.fork(timeline, newPresent))
}

function bindUndo(setTimeline) {
  return (steps = 1) =>
    setTimeline((timeline) => Timeline.shiftToPast(timeline, steps))
}

function bindRedo(setTimeline) {
  return (steps = 1) =>
    setTimeline((timeline) => Timeline.shiftToFuture(timeline, steps))
}
