describe('Basic search from home page', () => {
  it('should show at least one app-node for "wolf" search from home page', () => {
    cy.visit('/');
    cy.get('#search-input').type('wolf');
    cy.get('#search-input').type('{enter}');
    cy.get('app-node').should('have.length.at.least', 1);
  });
});
