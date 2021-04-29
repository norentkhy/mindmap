// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')


//https://stackoverflow.com/questions/55298710/how-to-get-values-of-multiple-aliases-without-introducing-callback-hell-in-cypre
const chainStart = Symbol();
cy.all = function ( ...commands ) {
    const _           = Cypress._;
    const chain       = cy.wrap(null, { log: false });
    const stopCommand = _.find( cy.queue.commands, {
        attributes: { chainerId: chain.chainerId }
    });
    const startCommand = _.find( cy.queue.commands, {
        attributes: { chainerId: commands[0].chainerId }
    });
    const p = chain.then(() => {
        return _( commands )
            .map( cmd => {
                return cmd[chainStart]
                    ? cmd[chainStart].attributes
                    : _.find( cy.queue.commands, {
                        attributes: { chainerId: cmd.chainerId }
                    }).attributes;
            })
            .concat(stopCommand.attributes)
            .slice(1)
            .map( cmd => {
                return cmd.prev.get('subject');
            })
            .value();
    });
    p[chainStart] = startCommand;
    return p;
}