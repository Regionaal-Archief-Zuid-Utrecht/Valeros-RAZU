declare global {
  namespace Cypress {
    interface Chainable {
      saveConsoleLogs(filename: string): Chainable<void>;
    }
  }
}

export {};
