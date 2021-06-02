export default {
  init,
  fork,
  shiftToPast,
  shiftToFuture,
  shiftToStart,
  shiftToEnd,
}

function init(initialPresent = null) {
  return { pasts: [], present: initialPresent, futures: [] }
}

function fork(timeline, newPresent) {
  return {
    pasts: [...timeline.pasts, timeline.present],
    present: newPresent,
    futures: [],
  }
}

function shiftToPast(timeline, steps) {
  const { pasts, present, futures } = timeline
  if (pasts.length < steps) return shiftToStart(timeline)

  return {
    pasts: pasts.slice(0, -steps),
    present: pasts[pasts.length - steps],
    futures:
      steps === 1
        ? [present, ...futures]
        : [...pasts.slice(-steps + 1), present, ...futures],
  }
}

function shiftToStart(timeline) {
  const { pasts, present, futures } = timeline
  if (pasts.length === 0) return timeline
  return {
    pasts: [],
    present: pasts[0],
    futures: [...pasts.slice(1), present, ...futures],
  }
}

function shiftToFuture(timeline, steps) {
  const { pasts, present, futures } = timeline
  if (futures.length < steps) return shiftToEnd(timeline)

  return {
    futures: futures.slice(steps),
    present: futures.slice(steps - 1, steps)[0],
    pasts:
      steps === 1
        ? [...pasts, present]
        : [...pasts, present, ...futures.slice(0, steps - 1)],
  }
}

function shiftToEnd(timeline) {
  const { pasts, present, futures } = timeline
  if (futures.length === 0) return timeline
  return {
    pasts: [...pasts, present, ...futures.slice(0, -1)],
    present: futures[futures.length - 1],
    futures: [],
  }
}
