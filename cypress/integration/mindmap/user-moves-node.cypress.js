import { label } from './view'

describe('Navigation', () => {
  it('visit', () => {
    cy.visit('http://localhost:8080/mindmap')

    cy.findByLabelText(label.mindSpace)
      .as('MindSpace')
      .then(([MindSpace]) => ({
        MindSpace,
        offsetCenter: calculateOffsetCenter(MindSpace),
      }))
      .then(({ MindSpace, offsetCenter }) => {
        cy.wrap(offsetCenter).as('offsetCenter')
        cy.wrap(MindSpace).dblclick([offsetCenter.left, offsetCenter.top])
      })

    cy.all(
      cy.findByLabelText(label.node),
      cy.get('@MindSpace'),
      cy.get('@offsetCenter')
    )
      .then(([[Node], [MindSpace], offsetCenter]) => ({
        Node,
        MindSpace,
        offsetCenter,
      }))
      .then(({ Node, MindSpace, offsetCenter }) => ({
        offsetNode: calculateOffsetFromMindSpace({ Element: Node, MindSpace }),
        offsetCenter,
      }))
      .should(({ offsetNode, offsetCenter }) => {
        expectTargetToSurroundPoint({ target: offsetNode, point: offsetCenter })
      })

    function expectTargetToSurroundPoint({ target, point }) {
      expect(target.left).to.be.below(point.left)
      expect(target.left + target.width).to.be.above(point.left)
      expect(target.top).to.be.below(point.top)
      expect(target.top + target.height).to.be.above(point.top)
    }

    function calculateOffsetCenter(Element) {
      const { offsetWidth, offsetHeight } = Element
      const left = offsetWidth / 2
      const top = offsetHeight / 2

      return { left, top }
    }

    function calculateOffsetFromMindSpace({ Element, MindSpace }) {
      const MindSpaceRect = MindSpace.getBoundingClientRect()
      const ElementRect = Element.getBoundingClientRect()

      return {
        left: ElementRect.left - MindSpaceRect.left,
        top: ElementRect.top - MindSpaceRect.top,
        width: ElementRect.width,
        height: ElementRect.height,
      }
    }
  })
})
