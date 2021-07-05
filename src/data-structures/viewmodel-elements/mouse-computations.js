export function computeCenterOffset(event, parentElement) {
  const { clientX, clientY } = event
  const target = parentElement ? parentElement : event.target
  const { left, top } = target.getBoundingClientRect()

  return {
    left: clientX - left,
    top: clientY - top,
  }
}
