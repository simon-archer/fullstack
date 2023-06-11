Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
        username, password
    }).then(({ body }) => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
        cy.visit('')
    })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
    cy.request({
        url: `${Cypress.env('BACKEND')}/blogs`,
        method: 'POST',
        body: { title, author, url, likes },
        headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
        }
    })

    cy.visit('')
})