describe('Debug Mirador CSS issues', () => {
  const dutchSearchTerms = [
    'wolf',
    'huis',
    'kerk',
    'straat',
    'water',
    'boom',
    'stad',
  ];

  const getRandomSearchTerm = () => {
    return dutchSearchTerms[
      Math.floor(Math.random() * dutchSearchTerms.length)
    ];
  };

  const searchForTerm = (term: string) => {
    cy.get('#search-input').should('exist');
    cy.get('#search-input').type(term);
    cy.get('#search-input').type('{enter}');
  };

  const clickRandomNode = () => {
    cy.get('app-node')
      .should('have.length.at.least', 1)
      .then(($nodes) => {
        const randomIndex = Math.floor(Math.random() * $nodes.length);
        cy.wrap($nodes[randomIndex]).click();
      });
  };

  const verifyMiradorExists = () => {
    cy.get('#mirador').should('exist');
    cy.get('.mirador-primary-window').should('exist');
    cy.get('button[aria-label="Full screen"]').should('exist');
    cy.get(
      'text[lengthAdjust="spacingAndGlyphs"], tspan[lengthAdjust="spacingAndGlyphs"]',
    ).should('exist');
    cy.get('canvas[aria-label="Digitized view"]').should('exist');
    cy.wait(1000);
    cy.screenshot('mirador-loaded');
  };

  const goBackToSearch = () => {
    cy.get('app-details-back-button button').click();
  };

  const clearAndSearchForTerm = (term: string) => {
    cy.get('#search-input').should('exist');
    cy.get('#search-input').type('{selectall}{backspace}' + term);
    cy.get('#search-input').type('{enter}');
  };

  const selectFilter = () => {
    // cy.get('button[app-filter-button]:visible').click();
    // cy.get('button[app-filter-button]:visible').should(
    //   'have.attr',
    //   'aria-expanded',
    //   'true',
    // );

    cy.get('app-filter-options').should('exist');

    cy.get('input[name="filter-accordion"][type="checkbox"]').then(
      ($accordions) => {
        if ($accordions.length > 0) {
          const randomIndex = Math.floor(Math.random() * $accordions.length);
          cy.wrap($accordions[randomIndex]).check({ force: true });
        }
      },
    );

    cy.get('app-filter-option div.form-control:visible').then(($options) => {
      if ($options.length > 0) {
        const randomIndex = Math.floor(Math.random() * $options.length);
        cy.wrap($options[randomIndex]).click();
      }
    });

    // cy.get('button[app-filter-button]:visible').click({ force: true });
    // cy.get('button[app-filter-button]:visible').should(
    //   'have.attr',
    //   'aria-expanded',
    //   'false',
    // );
  };

  const performRandomAction = () => {
    const actions = [
      () => {
        cy.log('Action: Searching for new term');
        const randomTerm = getRandomSearchTerm();
        clearAndSearchForTerm(randomTerm);
      },
      () => {
        cy.log('Action: Selecting search result');
        cy.get('app-node').then(($nodes) => {
          if ($nodes.length > 0) {
            clickRandomNode();
            verifyMiradorExists();
            goBackToSearch();
          }
        });
      },
      () => {
        cy.log('Action: Applying filter');
        selectFilter();
      },
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();
  };

  it('should randomly interact with search, results, and filters (100 iterations)', () => {
    const iterations = 100;

    cy.visit('/');

    const initialTerm = getRandomSearchTerm();
    searchForTerm(initialTerm);
    cy.wait(1000);

    for (let i = 0; i < iterations; i++) {
      cy.log(`Iteration ${i + 1} of ${iterations}`);
      performRandomAction();
      cy.wait(500);
    }

    cy.get('body').should('exist');
  });
});
