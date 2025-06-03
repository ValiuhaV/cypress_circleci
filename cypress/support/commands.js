import { faker } from '@faker-js/faker';

Cypress.Commands.add('sendRequest', (url, method, body = null) => {
  return cy.request({
    url: url,
    method: method,
    headers: {
      'Authorization': 'pk_200437946_XNO3KOMF6KQD9B65F9JGGQUTGWOD7PFN',
      'Content-Type': 'application/json'
    },
    failOnStatusCode: false,
    body: body
  });
});

Cypress.Commands.add('sendInvalidTokenRequest', (url, method, body = null) => {
  return cy.request({
    url: url,
    method: method,
    headers: {
      'Authorization': 'pk_188617329',
      'Content-Type': 'application/json'
    },
    failOnStatusCode: false,
    body: body
  });
});

Cypress.Commands.add('sendEmptyTokenRequest', (url, method, body = null) => {
  return cy.request({
    url: url,
    method: method,
    headers: {
      'Authorization': '',
      'Content-Type': 'application/json'
    },
    failOnStatusCode: false,
    body: body
  });
});


Cypress.Commands.add('createGoal', () => {
  return cy.sendRequest('team/90151219267/goal', 'POST', {
    name: faker.company.name(),
    description: faker.company.catchPhrase()
  });
});

Cypress.Commands.add('createGoalFromFile', (body) => {
  cy.sendRequest('team/90151219267/goal', 'POST', body)
  });


Cypress.Commands.add('getAllGoals', () => {
  return cy.sendRequest('team/90151219267/goal', 'GET')
});
