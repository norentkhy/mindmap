function isElementInView({
  container,
  element,
  ignoreVertical = false,
  ignoreHorizontal = false,
  ignorePartial = false,
}) {
  const containerBox = container.getBoundingClientRect()
  const elementBox = element.getBoundingClientRect()

  const isOutsideUp = ignorePartial
    ? elementBox.top < containerBox.top
    : elementBox.bottom < containerBox.top
  const isOutsideDown = ignorePartial
    ? elementBox.bottom > containerBox.bottom
    : elementBox.top > containerBox.bottom
  const isOutsideLeft = ignorePartial
    ? elementBox.left < containerBox.left
    : elementBox.right < containerBox.left
  const isOutsideRight = ignorePartial
    ? elementBox.right > containerBox.right
    : elementBox.left > containerBox.right

  const isVerticallyInView = ignoreVertical || (!isOutsideUp && !isOutsideDown)
  const isHorizontallyInView =
    ignoreHorizontal || (!isOutsideLeft && !isOutsideRight)

  return isVerticallyInView && isHorizontallyInView
}

export default isElementInView
