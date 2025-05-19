Cypress.Commands.add('fillMandatoryFieldsAndSubmit', ( { firstName, lastName, email, message }) => {
    cy.get('#firstName').type(firstName)
    cy.get('#lastName').type(lastName)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(message)
    cy.get('button[type="submit"]').click()
})