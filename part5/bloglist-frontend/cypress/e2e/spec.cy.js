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
})


// describe('Note ', function () {
//   beforeEach(function () {
//     cy.visit('')
//     cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
//     const user = {
//       name: 'Matti Luukkainen',
//       username: 'mluukkai',
//       password: 'salainen'
//     }
//     cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
//   })

//   it('front page can be opened', function () {
//     cy.contains('Notes')
//     cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
//   })

//   it('login form can be opened', function () {
//     cy.contains('log in').click()
//     cy.get('#username').type('mluukkai')
//     cy.get('#password').type('salainen')
//     cy.get('#login-button').click()

//     cy.contains('Matti Luukkainen logged in')
//   })

//   describe('when logged in', function () {
//     beforeEach(function () {
//       cy.login({ username: 'mluukkai', password: 'salainen' })
//     })

//     it('a new note can be created', function () {
//       cy.contains('new note').click()
//       cy.get('input').type('a note created by cypress')
//       cy.contains('save').click()
//       cy.contains('a note created by cypress')
//     })

//     describe('and several notes exist', function () {
//       beforeEach(function () {
//         cy.createNote({ content: 'first note', important: false })
//         cy.createNote({ content: 'second note', important: false })
//         cy.createNote({ content: 'third note', important: false })
//       })

//       it('one of those can be made important', function () {
//         cy.contains('second note').parent().find('button').as('theButton')
//         cy.get('@theButton').click({ multiple: true })
//         cy.get('@theButton').should('contain', 'make not important')
//       })
//     })
//   })

//   it('login fails with wrong password', function () {
//     cy.contains('log in').click()
//     cy.get('#username').type('mluukkai')
//     cy.get('#password').type('wrong')
//     cy.get('#login-button').click()

//     cy.get('.error')
//       .should('contain', 'wrong credentials')
//       .and('have.css', 'color', 'rgb(255, 0, 0)')
//       .and('have.css', 'border-style', 'solid')

//     cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
//   })

//   it('then example', function () {
//     cy.get('button').then(buttons => {
//       console.log('number of buttons', buttons.length)
//       cy.wrap(buttons[0]).click()
//     })
//   })
// })