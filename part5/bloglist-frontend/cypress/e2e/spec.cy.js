describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('')
    cy.contains('login').click
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user2 = {
      name: 'Superuser',
      username: 'Mark',
      password: 'Zuck'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)

    const user = {
      name: 'Superuser',
      username: 'Silver',
      password: 'Dreyer'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
  })

  it('Login form is shown', function () {
    cy.contains('login').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('Silver')
      cy.get('#password').type('Dreyer')
      cy.get('button[type="submit"]').click()
      cy.contains('Superuser logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('Silver')
      cy.get('#password').type('Wrong')
      cy.get('button[type="submit"]').click()
      cy.contains('Wrong credentials').should('have.css', 'color', 'rgb(255, 0, 0)');
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'Silver', password: 'Dreyer' })
    })

    it('A blog can be created', function () {
      cy.contains('create').click()
      cy.get('input[type="text"][placeholder="Title:"]').type('Quest')
      cy.get('input[type="text"][placeholder="Author:"]').type('Zuck')
      cy.get('input[type="text"][placeholder="Url:"]').type('Meta')
      cy.get('button[type="submit"]').click()
      cy.contains('Quest')
      cy.contains('Zuck')
    })

    it('a blog can be liked', function () {
      cy.contains('create').click()
      cy.get('input[type="text"][placeholder="Title:"]').type('Quest')
      cy.get('input[type="text"][placeholder="Author:"]').type('Zuck')
      cy.get('input[type="text"][placeholder="Url:"]').type('Meta')
      cy.get('button[type="submit"]').click()
      cy.contains('Quest')
      cy.contains('Zuck')
      cy.contains('view').click()
      cy.contains('button', 'like').click()
      cy.contains(1)
    })

    it('owner can delete blog', function () {
      cy.contains('create').click()
      cy.get('input[type="text"][placeholder="Title:"]').type('Quest')
      cy.get('input[type="text"][placeholder="Author:"]').type('Zuck')
      cy.get('input[type="text"][placeholder="Url:"]').type('Meta')
      cy.get('button[type="submit"]').click()
      cy.contains('Quest')
      cy.contains('Zuck')
      cy.contains('view').click()
      cy.contains('button', 'delete').click()
      cy.get('html').should('not.contain', '.blog')
    })

    it('others will not see delete button', function () {
      cy.contains('create').click()
      cy.get('input[type="text"][placeholder="Title:"]').type('Quest')
      cy.get('input[type="text"][placeholder="Author:"]').type('Zuck')
      cy.get('input[type="text"][placeholder="Url:"]').type('Meta')
      cy.get('button[type="submit"]').click()
      cy.contains('Quest')
      cy.contains('Zuck')
      cy.contains('logout').click()

      cy.contains('login').click()
      cy.get('#username').type('Mark')
      cy.get('#password').type('Zuck')
      cy.get('button[type="submit"]').click()

      cy.contains('view').click()
      cy.get('.blog').should('not.contain', 'delete')
    })
  })

  describe('Blogs are ordered', function () {
    it('according to likes', function () {
      cy.login({ username: 'Silver', password: 'Dreyer' })

      cy.createBlog({
        title: '5Likes',
        author: 'Silver',
        url: 'last',
        likes: 5
      })

      cy.createBlog({
        title: '10Likes',
        author: 'Silver',
        url: 'first',
        likes: 10
      })

      cy.visit('')
      cy.get('.blog').eq(0).should('contain', '10Likes')
      cy.get('.blog').eq(1).should('contain', '5Likes')
    })
  })
})