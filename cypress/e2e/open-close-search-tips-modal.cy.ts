describe('Search tips modal functionality', () => {
  const testUrls = {
    home: '/',
    search: '/search?q=wolf',
    details:
      '/details/https%253A%252F%252Fdata.razu.nl%252Fid%252Fobject%252Fnl-wbdrazu-k50907905-689-774056%25237?q=wolf',
  };

  const openModal = () => {
    cy.get('app-search-tips button').first().click();
    cy.get('#searchmodal').should('be.visible');
    cy.get('#search-tips-title').should('contain', 'Zoektips');
  };

  const closeModal = (selector: string) => {
    cy.get(selector).click();
    cy.get('#searchmodal').should('not.be.visible');
  };

  const clickOutsideModal = () => {
    cy.get('#searchmodal').click('topLeft');
    cy.get('#searchmodal').should('not.be.visible');
  };

  Object.entries(testUrls).forEach(([context, url]) => {
    it(`should open and close search tips modal from ${context} page`, () => {
      cy.visit(url);

      openModal();
      closeModal('#searchmodal .modal-action button[aria-label="Sluiten"]');

      openModal();
      clickOutsideModal();
    });
  });
});
