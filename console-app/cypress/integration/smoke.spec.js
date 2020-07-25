describe('Smoke test', function() {
    beforeEach(function() {
        cy.visit('/');
    });

    describe('smoke test', () => {
        it('sign in and open a transport', () => {
            cy.get(selectors.usernameInput).type(Cypress.env('username'));
            cy.get(selectors.signInPasswordInput).type(Cypress.env('password'));
            cy.get(selectors.signInSignInButton).contains('Sign In').click();
            cy.contains('bob57@desert-spring.nl');
            cy.get('tbody > :nth-child(1) > :nth-child(1) > a').click()
            cy.contains("Transport")
            cy.get('.inverted > :nth-child(3)').click()
        });
    });

});
export const selectors = {
    // Auth component classes
    usernameInput: '[data-test="username-input"]',
    signInPasswordInput: '[data-test="sign-in-password-input"]',
    signInSignInButton: '[data-test="sign-in-sign-in-button"]'
}