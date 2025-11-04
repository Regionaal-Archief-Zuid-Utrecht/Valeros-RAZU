import './commands';

const consoleLogs: string[] = [];

Cypress.on('window:before:load', (win) => {
  const originalLog = win.console.log;
  const originalWarn = win.console.warn;
  const originalError = win.console.error;

  win.console.log = function (...args: any[]) {
    consoleLogs.push(`[LOG] ${args.join(' ')}`);
    originalLog.apply(win.console, args);
  };

  win.console.warn = function (...args: any[]) {
    consoleLogs.push(`[WARN] ${args.join(' ')}`);
    originalWarn.apply(win.console, args);
  };

  win.console.error = function (...args: any[]) {
    consoleLogs.push(`[ERROR] ${args.join(' ')}`);
    originalError.apply(win.console, args);
  };
});

Cypress.Commands.add('saveConsoleLogs', (filename: string) => {
  cy.writeFile(filename, consoleLogs.join('\n'));
});
