import isElementInView from './isElementInView'

const container = createObjectWithBoundingClientRect(0, 100, 0, 100)

describe('isElementInView: standard', () => {
  test('definitely out of top view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(-100, -50, 0, 100),
    }
    expect(isElementInView(context)).toBe(false)
  })

  test('definitely out of bottom view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(120, 150, 0, 100),
    }
    expect(isElementInView(context)).toBe(false)
  })

  test('definitely out of left view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(20, 70, -100, -50),
    }
    expect(isElementInView(context)).toBe(false)
  })

  test('definitely out of right view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(20, 70, 150, 200),
    }
    expect(isElementInView(context)).toBe(false)
  })

  test('definitely in view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(30, 50, 30, 50),
    }
    expect(isElementInView(context)).toBe(true)
  })

  test('partially in view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(-10, 50, -30, 50),
    }
    expect(isElementInView(context)).toBe(true)
  })
})

describe('isElementInView: extended options', () => {
  test('ignoreVertical: definitely out of vertical view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(-100, -50, -100, -50),
      ignoreVertical: true,
    }
    expect(isElementInView(context)).toBe(false)
  })

  test('ignoreVertical: partially in vertical view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(-20, 50, -100, -50),
      ignoreHorizontal: true,
    }
    expect(isElementInView(context)).toBe(true)
  })

  test('ignoreHorizontal: definitely out of horizontal view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(-100, -50, -100, -50),
      ignoreHorizontal: true,
    }
    expect(isElementInView(context)).toBe(false)
  })

  test('ignoreHorizontal: definitely in horizontal view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(-100, -50, 10, 50),
      ignoreVertical: true,
    }
    expect(isElementInView(context)).toBe(true)
  })

  test('ignorePartial: partially in view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(-20, 50, -30, 40),
      ignorePartial: true,
    }
    expect(isElementInView(context)).toBe(false)
  })

  test('ignorePartial: fully in view', () => {
    const context = {
      container,
      element: createObjectWithBoundingClientRect(10, 90, 20, 70),
      ignorePartial: true,
    }
    expect(isElementInView(context)).toBe(true)
  })

  test('ignorePartial: element same size as container', () => {
    const context = {
      container,
      element: container,
      ignorePartial: true,
    }
    expect(isElementInView(context)).toBe(true)
  })
})

function createObjectWithBoundingClientRect(top, bottom, left, right) {
  return {
    getBoundingClientRect() {
      return {
        top,
        bottom,
        left,
        right,
      }
    },
  }
}
