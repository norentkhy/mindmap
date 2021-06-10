export function computeCenterOffset(event) {
  const { clientX, clientY, target } = event
  const { left, top } = target.getBoundingClientRect()
  return {
    left: clientX - left,
    top: clientY - top,
  }
}
