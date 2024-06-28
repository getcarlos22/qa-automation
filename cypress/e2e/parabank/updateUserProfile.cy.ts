/// <reference types="cypress" />

import { faker } from '@faker-js/faker'
import { UserInfo } from '../../fixtures/types'

describe('Parabank user details', () => {
    let user: any;
  
    before(function () {
      // Load the user fixture data before running the tests
      cy.fixture('user').then(function (data) {
        user = data;
      })
    })

    it('Updates user profile', () => {
        cy.visit('https://parabank.parasoft.com/parabank/index.htm')
        cy.get('input[name="username"]').type(user.email)
        cy.get('input[name="password"]').type(user.password)
        cy.get('input[value="Log In"]').click()
    
        cy.contains('Update Contact Info').click()
    
        const newCity = faker.address.cityName()
        cy.get('input[name="customer.address.city"]').clear().type(newCity)
        cy.get('input[name="customer.phoneNumber"]').clear().type(faker.phone.number('############'))
        cy.get('input[value="Update Profile"]').click()
    
        cy.contains('Your updated address and phone number have been added to the system.')
        cy.get('input[name="customer.address.city"]').should('have.value', newCity)
      })
    
      it('Requests a loan', () => {
        cy.visit('https://parabank.parasoft.com/parabank/index.htm')
        cy.get('input[name="username"]').type(user.email)
        cy.get('input[name="password"]').type(user.password)
        cy.get('input[value="Log In"]').click()
    
        cy.contains('Request Loan').click()
        cy.get('input[name="amount"]').type('5000')
        cy.get('input[name="downPayment"]').type('1000')
    
        cy.get('select[name="fromAccountId"]').then($select => {
          const fromAccountId = $select.val();
          if (typeof fromAccountId === 'string' || typeof fromAccountId === 'number') {
            cy.get('input[value="Apply Now"]').click()
          }
        })
    
        cy.contains('Loan Request Processed')
        cy.contains('Approved')
      })
    
      it('Views account activity', () => {
        cy.visit('https://parabank.parasoft.com/parabank/index.htm')
        cy.get('input[name="username"]').type(user.email)
        cy.get('input[name="password"]').type(user.password)
        cy.get('input[value="Log In"]').click()
    
        cy.contains('Accounts Overview').click()
        cy.get('a').contains('13344').click() // Replace with actual account id
    
        cy.url().should('include', '/activity.htm')
        cy.contains('Account Details')
        cy.contains('Transactions')
  })
})
