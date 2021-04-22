import React, { useEffect } from 'react'
import { ui, viewmodel } from '~mindmap/test-utilities'
import { fireEvent, screen } from '@testing-library/react'
import WheelFeedbackContainer from '../../components/WheelFeedbackContainer/WheelFeedbackContainer'

describe('wheel feedback container', () => {
  test('initial feedback', () => {
    const handleWheelFeedback = renderWithChildHandlingFeedback()

    viewmodel.expect.mockFunction(handleWheelFeedback).nthCalledWith(1, {
      id: 0,
      atBoundary: { left: true, top: true, right: false, bottom: false },
    })
  })

  test('feedback on hitting left boundary', () => {
    const handleWheelFeedback = renderWithChildHandlingFeedback()

    const amountLeft = 10
    simulateWheel({ Element: queryScrollBoundaryContainer() }).hittingLeft({
      delta: { left: amountLeft },
    })

    viewmodel.expect.mockFunction(handleWheelFeedback).nthCalledWith(2, {
      id: 1,
      atBoundary: { left: true, top: true, right: false, bottom: false },
      amount: { left: amountLeft, right: 0, top: 0, bottom: 0 },
    })
  })

  test('feedback on hitting right boundary', () => {
    const handleWheelFeedback = renderWithChildHandlingFeedback()

    const amountRight = 10
    simulateWheel({ Element: queryScrollBoundaryContainer() }).hittingRight({
      delta: { right: amountRight },
    })

    viewmodel.expect.mockFunction(handleWheelFeedback).nthCalledWith(2, {
      id: 1,
      atBoundary: { left: false, top: true, right: true, bottom: false },
      amount: { left: 0, right: amountRight, top: 0, bottom: 0 },
    })
  })

  test('feedback on hitting top boundary', () => {
    const handleWheelFeedback = renderWithChildHandlingFeedback()

    const amountTop = 10
    simulateWheel({ Element: queryScrollBoundaryContainer() }).hittingTop({
      delta: { top: amountTop },
    })

    viewmodel.expect.mockFunction(handleWheelFeedback).nthCalledWith(2, {
      id: 1,
      atBoundary: { left: true, top: true, right: false, bottom: false },
      amount: { left: 0, right: 0, top: amountTop, bottom: 0 },
    })
  })

  test('feedback on hitting bottom boundary', () => {
    const handleWheelFeedback = renderWithChildHandlingFeedback()

    const amountBottom = 10
    simulateWheel({ Element: queryScrollBoundaryContainer() }).hittingBottom({
      delta: { bottom: amountBottom },
    })

    viewmodel.expect.mockFunction(handleWheelFeedback).nthCalledWith(2, {
      id: 1,
      atBoundary: { left: true, top: false, right: false, bottom: true },
      amount: { left: 0, right: 0, top: 0, bottom: amountBottom },
    })
  })

  test('feedback on hitting nothing', () => {
    const handleWheelFeedback = renderWithChildHandlingFeedback()

    const delta = { left: 5, top: 5 }
    simulateWheel({ Element: queryScrollBoundaryContainer() }).state({
      delta,
      scroll: { xPercentage: 55, yPercentage: 45 },
    })

    viewmodel.expect.mockFunction(handleWheelFeedback).nthCalledWith(2, {
      id: 1,
      atBoundary: { left: false, right: false, top: false, bottom: false },
      amount: { left: delta.left, right: 0, top: delta.top, bottom: 0 },
    })
  })

  function renderWithChildHandlingFeedback() {
    const handleWheelFeedback = viewmodel.create.mockFunction()
    ui.renderView({
      JSX: (
        <WheelFeedbackContainer>
          <MindCanvasMock onWheelFeedback={handleWheelFeedback} />
        </WheelFeedbackContainer>
      ),
    })

    return handleWheelFeedback
  }

  function MindCanvasMock({ onWheelFeedback = () => {}, wheelFeedback }) {
    useEffect(() => {
      onWheelFeedback(wheelFeedback)
    }, [wheelFeedback.id])

    return <div>canvas</div>
  }

  function queryScrollBoundaryContainer() {
    return screen.queryByLabelText(
      'container for detection of scolling at boundary'
    )
  }
})

function simulateWheel({
  Element,
  offsetWidth = 100,
  offsetHeight = 100,
  scrollWidth = 300,
  scrollHeight = 300,
}) {
  if (Element.offsetWidth === 0) setElementProperties({ offsetWidth })
  if (Element.offsetHeight === 0) setElementProperties({ offsetHeight })
  if (Element.scrollWidth === 0) setElementProperties({ scrollWidth })
  if (Element.scrollHeight === 0) setElementProperties({ scrollHeight })

  return {
    hittingLeft({ delta: { left = 0, right = 0, top = 0, bottom = 0 } }) {
      setElementProperties({ scrollLeft: 0 })
      triggerEvent({ delta: { left, right, top, bottom } })
    },
    hittingRight({ delta: { left = 0, right = 0, top = 0, bottom = 0 } }) {
      setElementProperties({
        scrollWidth,
        offsetWidth,
        scrollLeft: scrollWidth - offsetWidth,
      })
      triggerEvent({ delta: { left, right, top, bottom } })
    },
    hittingTop({ delta: { left = 0, right = 0, top = 0, bottom = 0 } }) {
      setElementProperties({ scrollTop: 0 })
      triggerEvent({ delta: { left, right, top, bottom } })
    },
    hittingBottom({ delta: { left = 0, right = 0, top = 0, bottom = 0 } }) {
      setElementProperties({
        scrollHeight,
        offsetHeight,
        scrollTop: scrollHeight - offsetHeight,
      })
      triggerEvent({ delta: { left, right, top, bottom } })
    },
    state({
      delta: { left = 0, right = 0, top = 0, bottom = 0 },
      scroll: { xPercentage, yPercentage },
    }) {
      setElementProperties({
        scrollWidth,
        offsetWidth,
        scrollLeft: (xPercentage / 100) * (scrollWidth - offsetWidth),
        scrollHeight,
        offsetHeight,
        scrollTop: (yPercentage / 100) * (scrollHeight - offsetHeight),
      })
      triggerEvent({ delta: { left, right, top, bottom } })
    },
  }

  function triggerEvent({ delta: { left, right, top, bottom } }) {
    const deltaX = -left + right
    const deltaY = -top + bottom
    fireEvent.wheel(Element, { deltaX, deltaY })
  }

  function setElementProperties(properties) {
    const entries = Object.entries(properties)
    entries.forEach(([key, value]) => {
      jest.spyOn(Element, key, 'get').mockImplementation(() => value)
    })
  }
}
