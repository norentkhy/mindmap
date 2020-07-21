function canScrollUp(element) {
  const distanceUp = element.scrollTop
  return distanceUp > 0
}

function canScrollDown(element) {
  const distanceDown =
    element.scrollHeight - element.offsetHeight - element.scrollTop
  return distanceDown > 0
}

function canScrollLeft(element) {
  const distanceLeft = element.scrollLeft
  return distanceLeft > 0
}

function canScrollRight(element) {
  const distanceRight =
    element.scrollWidth - element.offsetWidth - element.scrollLeft
  return distanceRight > 0
}

function scrollHeightUp(element) {
  const top = element.scrollTop - element.offsetHeight
  element.scroll({ top, behavior: 'smooth' })
}

function scrollHeightDown(element) {
  const top = element.scrollTop + element.offsetHeight
  element.scroll({ top, behavior: 'smooth' })
}

function scrollWidthLeft(element) {
  const left = element.scrollLEft - element.offsetWidth
  element.scroll({ left, behavior: 'smooth' })
}

function scrollWidthRight(element) {
  const left = element.scrollLeft + element.offsetWidth
  element.scroll({ left, behavior: 'smooth' })
}

export {
  canScrollUp,
  canScrollDown,
  canScrollLeft,
  canScrollRight,
  scrollHeightUp,
  scrollHeightDown,
  scrollWidthLeft,
  scrollWidthRight,
}
