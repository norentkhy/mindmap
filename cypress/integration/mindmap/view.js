export function getView(cy) {
  return {
    get,
    dblClickOnMindSpace(...args) {
      get.MindSpace(cy).dblclick(...args)
    }
  }
}

export const get = {
  MindSpace: (cy) => cy.findByLabelText(label.mindSpace),
  Node: (cy) => cy.findByLabelText(label.node)
}

export const label = {
  mindSpace: 'main view',
  node: 'node'
}