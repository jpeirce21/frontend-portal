// experimenting_spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
let URL = "http://localhost:3000";
describe("Anonymous user tests", () => {
    it("Locate community portal", () => {
        cy.visit(URL).get('h1').should('be.visible');
    }),
    it("Continues to a community page", () => {
        cy.get("a[href*=Test]").click();
        cy.get("h4").should("have.class", "cool-font");
    })
})
