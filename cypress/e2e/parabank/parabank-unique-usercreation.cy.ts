/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { UserInfo } from '../../fixtures/types'

// Generate a fake user using Faker.js
const user: UserInfo = {
  name: faker.name.firstName(),
  lname: faker.name.lastName(),
  city: faker.address.cityName(),
  phone: faker.phone.number('############'),
  zipCode: faker.address.zipCode('#####'),
  email: faker.internet.email(),
  state: faker.address.state(),
  street: faker.address.streetAddress(false),
  ssn: faker.phone.number('#####'),
}

describe('Parabank user details', () => {
  let fixtureData: any;

  // Load fixture data before running tests
  before(function () {
    cy.fixture('user').then(function (data) {
      fixtureData = data;
    })
  })

  it('Registers a new user', () => {
    // Visit the Parabank homepage
    cy.visit('https://parabank.parasoft.com/parabank/index.htm')
    cy.contains('Register').click()

    // Fill in the registration form with the fake user data
    cy.get('input[name="customer.firstName"]').type(user.name)
    cy.get('input[name="customer.lastName"]').type(user.lname)
    cy.get('input[name="customer.address.street"]').type(user.street)
    cy.get('input[name="customer.address.city"]').type(user.city)
    cy.get('input[name="customer.address.state"]').type(user.state)
    cy.get('input[name="customer.address.zipCode"]').type(user.zipCode)
    cy.get('input[name="customer.phoneNumber"]').type(user.phone)
    cy.get('input[name="customer.ssn"]').type(user.ssn)
    cy.get('input[name="customer.username"]').type(user.email)
    cy.get('input[name="customer.password"]').type(fixtureData.password)
    cy.get('input[name="repeatedPassword"]').type(fixtureData.password)

    // Submit the registration form
    cy.get('input[value="Register"]').click()

    // Verify successful registration
    cy.contains('Your account was created successfully. You are now logged in.')

    // Save the created user details to a fixture file
    const createdUser = [{ username: user.email, password: fixtureData.password }];
    cy.writeFile('cypress/fixtures/createdUser.json', createdUser);
  })

  it('Logs in as the newly created user', () => {
    // Visit the Parabank homepage and log in
    cy.visit('https://parabank.parasoft.com/parabank/index.htm')
    cy.get('input[name="username"]').type(user.email)
    cy.get('input[name="password"]').type(fixtureData.password)
    cy.get('input[value="Log In"]').click()

    // Verify successful login
    cy.url().should('include', '/overview.htm')
    cy.contains('Accounts Overview')
  })

  it('Transfers money from one bank account to another', () => {
    // Visit the Parabank homepage and log in
    cy.visit('https://parabank.parasoft.com/parabank/index.htm')
    cy.get('input[name="username"]').type(user.email)
    cy.get('input[name="password"]').type(fixtureData.password)
    cy.get('input[value="Log In"]').click()

    // Verify successful login and navigate to Transfer Funds page
    cy.url().should('include', '/overview.htm')
    cy.contains('Transfer Funds').click()
    cy.get('input[name="amount"]').type('100')

    // Retrieve and select account IDs dynamically
cy.get('select[name="fromAccountId"]').then($select => {
  const fromAccountId = $select.val();
  if (typeof fromAccountId === 'string' || typeof fromAccountId === 'number') {
    // Ensure the value is not undefined before using it
    cy.get('select[name="toAccountId"]').select($select.find('option').not(':selected').val() as string);
  }
});

    // Submit the transfer form
    cy.get('input[value="Transfer"]').click()

    // Verify successful transferx
    cy.contains('Transfer Complete!')
  })

  it('Updates user profile', () => {
    // Visit the Parabank homepage and log in
    cy.visit('https://parabank.parasoft.com/parabank/index.htm')
    cy.get('input[name="username"]').type(user.email)
    cy.get('input[name="password"]').type(fixtureData.password)
    cy.get('input[value="Log In"]').click()

    // Navigate to Update Contact Info page
    cy.contains('Update Contact Info').click()

    // Update user profile with new data
    const newCity = faker.address.cityName()
    cy.get('input[name="customer.address.city"]').clear().type(newCity)
    cy.get('input[name="customer.phoneNumber"]').clear().type(faker.phone.number('############'))
    cy.get('input[value="Update Profile"]').click()

    // Verify successful profile update
    cy.contains('Your updated address and phone number have been added to the system.')
    cy.get('input[name="customer.address.city"]').should('have.value', newCity)
  })

  it('Requests a loan', () => {
    // Visit the Parabank homepage and log in
    cy.visit('https://parabank.parasoft.com/parabank/index.htm')
    cy.get('input[name="username"]').type(user.email)
    cy.get('input[name="password"]').type(fixtureData.password)
    cy.get('input[value="Log In"]').click()

    // Navigate to Request Loan page
    cy.contains('Request Loan').click()
    cy.get('input[name="amount"]').type('5000')
    cy.get('input[name="downPayment"]').type('1000')

    // Select from account and apply for the loan
    cy.get('select[name="fromAccountId"]').then($select => {
      const fromAccountId = $select.val();
      cy.get('input[value="Apply Now"]').click()
    })

    // Verify successful loan request
    cy.contains('Loan Request Processed')
    cy.contains('Approved')
  })

  it('Views account activity', () => {
    // Visit the Parabank homepage and log in
    cy.visit('https://parabank.parasoft.com/parabank/index.htm')
    cy.get('input[name="username"]').type(user.email)
    cy.get('input[name="password"]').type(fixtureData.password)
    cy.get('input[value="Log In"]').click()

    // Navigate to Accounts Overview page and select an account
    cy.contains('Accounts Overview').click()
    cy.get('a').contains('13344').click() // Replace with actual account id

    // Verify account details and transactions
    cy.url().should('include', '/activity.htm')
    cy.contains('Account Details')
    cy.contains('Transactions')
  })
})
