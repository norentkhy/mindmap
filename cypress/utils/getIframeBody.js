function getIframeDocument() {
  return cy
    .get('#storybook-preview-iframe')
    .its('0.contentDocument')
    .should('exist')
}
function getIframeBody() {
  return getIframeDocument()
    .its('body')
    .should('not.be.undefined')
    .then(cy.wrap)
}

export default getIframeBody
