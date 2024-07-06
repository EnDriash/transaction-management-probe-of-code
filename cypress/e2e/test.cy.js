// DO NOT CHANGE THIS FILE!

const apiUrl = `${Cypress.env("apiUrl")}`

// We should create account first and then create transaction to keep account balance updated
// This function generates a random UUID it can not be used as a real UUID cause we dont have real user data in db.
// it breaks e2e rules
function uuid() { 
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const accountId = '9c3cd9a8-65c4-4d26-8488-ef9a40f57c37' // just create testing seed and keep uuid
const anotherAccountId = 'fbf4a552-2418-46c5-b308-6094ddc493a1'

describe('Transaction Management Backend - Level 2', () => {
  
  it('Provides a functional healthcheck', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/health`,
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })   

  it('should create a transaction, read it, and fetch the updated account balance', () => {
    let userAccountSnapshot = {}
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    })
    .then((response) => {
      userAccountSnapshot = response.body
    }).
    request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        account_id: accountId,
        amount: 7
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.id).to.not.be.undefined
      const transactionId = response.body.id

        cy.request({
          failOnStatusCode: false,
          method: 'GET',
          url: `${apiUrl}/transactions/${transactionId}`,
        })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.id).to.eq(transactionId)
          expect(response.body.account_id).to.eq(accountId)
          expect(response.body.amount).to.eq(7)
        })
    })
    .request({
        failOnStatusCode: false,
        method: 'GET',
        url: `${apiUrl}/accounts/${accountId}`,
      })
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.id).to.eq(accountId)
        expect(response.body.balance).to.eq(userAccountSnapshot.balance + 7)
      })
  })

  it('should create transactions with negative amounts', () => {
    let userAccountSnapshot = {}
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    })
    .then((response) => {
      userAccountSnapshot = response.body
    }).
    request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: accountId,
        amount: 4
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.id).to.not.be.undefined
    }).request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.id).to.eq(accountId)
      expect(response.body.balance).to.eq(userAccountSnapshot.balance+4)
    }).request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/transactions`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        account_id: accountId,
        amount: -3
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.id).to.not.be.undefined
    }).request({ // read account balance
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.id).to.eq(accountId)
      expect(response.body.balance).to.eq(userAccountSnapshot.balance+4-3)
    })
  })
})

describe('Transaction Management Frontend - Level 2', () => {
  it('The app can submit new transactions and show the historical ones', () => {
    
    let userAccountSnapshot = {}
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/accounts/${accountId}`,
    })
    .then((response) => {
      userAccountSnapshot = response.body

    cy.visit('/', {timeout: 12000})
    // submit a transaction & verify the position on the list
      const amount = 30
      const balance = userAccountSnapshot.balance + amount

      cy.get('[data-type=account-id]').type(accountId)
      cy.get('[data-type=amount]').type(amount)
      cy.get('[data-type=transaction-submit]').click()
      cy.get(`[data-type=transaction][data-account-id=${accountId}][data-amount=${amount}][data-balance=${balance}]`).should('exist')

      // submit a new transaction to the same account and verify the balance
      const newAmount = 7
      const newBalance = balance + newAmount

      cy.get('[data-type=account-id]').type(accountId)
      cy.get('[data-type=amount]').type(newAmount)
      cy.get('[data-type=transaction-submit]').click()
      cy.get(`[data-type=transaction][data-account-id=${accountId}][data-amount=${newAmount}][data-balance=${newBalance}]`, { timeout: 10000 }).should('exist')

      let userAnotherAccountSnapshot = {}
      cy.request({
        failOnStatusCode: false,
        method: 'GET',
        url: `${apiUrl}/accounts/${anotherAccountId}`,
      })
      .then((response) => {
        userAnotherAccountSnapshot = response.body
        // submit another transaction & verify the position on the list
        const anotherAmount = 7
        const anotherBalance = userAnotherAccountSnapshot.balance + anotherAmount

        cy.get('[data-type=account-id]').type(anotherAccountId)
        cy.get('[data-type=amount]').type(anotherAmount)
        cy.get('[data-type=transaction-submit]').click()
        cy.get(`[data-type=transaction][data-account-id=${anotherAccountId}][data-amount=${anotherAmount}][data-balance=${anotherBalance}]`, { timeout: 10000 }).should('exist')

        // // submit a transaction with a negative amount & verify the position on the list
        const negativeAmount = -5
        const negativeBalance = anotherBalance + negativeAmount

        cy.get('[data-type=account-id]').type(anotherAccountId)
        cy.get('[data-type=amount]').type(negativeAmount)
        cy.get('[data-type=transaction-submit]').click()
        cy.get(`[data-type=transaction][data-account-id=${anotherAccountId}][data-amount=${negativeAmount}][data-balance=${negativeBalance}]`, { timeout: 10000 }).should('exist')
      })
    })
  })

  it('The app can handle invalid user input', () => {
    cy.visit('/')

    // invalid account_id
    const invalidAccountId = 123
    const invalidAccountIdAmount = 12
    cy.get('[data-type=account-id]').type(invalidAccountId)
    cy.get('[data-type=amount]').type(invalidAccountIdAmount)
    cy.get('[data-type=transaction-submit]').click({force: true})
    cy.get(`[data-type=transaction][data-account-id=${invalidAccountId}][data-amount=${invalidAccountIdAmount}]`).should('not.exist')

    const invalidAmountAccountId = uuid()
    const invalidAmount = 'abc'
    cy.get('[data-type=account-id]').type(invalidAmountAccountId)
    // invalid amount
    cy.get('[data-type=amount]').type(invalidAmount)
    cy.get('[data-type=transaction-submit]').click({force: true})
    cy.get(`[data-type=transaction][data-account-id=${invalidAmountAccountId}][data-amount=${invalidAmount}]`).should('not.exist')
    
  })
})
