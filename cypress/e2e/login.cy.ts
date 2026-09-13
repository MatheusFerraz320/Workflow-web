const apiUrl = 'http://localhost:3000';

describe('Authentication flow', () => {
  beforeEach(() => {
    cy.intercept('POST', `${apiUrl}/auth/login`, {
      statusCode: 200,
      body: {
        access_token: 'jwt-token',
        user: {
          id: 'user-1',
          name: 'João Silva',
          email: 'joao@empresa.com',
          role: 'USER',
        },
      },
    }).as('login');

    cy.intercept('GET', `${apiUrl}/users/me`, {
      statusCode: 200,
      body: {
        id: 'user-1',
        name: 'João Silva',
        email: 'joao@empresa.com',
        role: 'USER',
        avatar: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    }).as('me');

    cy.intercept('GET', `${apiUrl}/boards`, {
      statusCode: 200,
      body: [],
    }).as('boards');
  });

  it('logs in and navigates to the home page', () => {
    cy.visit('/login');

    cy.get('#email').type('joao@empresa.com');
    cy.get('#password').type('senha123');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
    cy.wait('@boards');

    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('jwt-token');
    });
  });

  it('shows an error message on invalid credentials', () => {
    cy.intercept('POST', `${apiUrl}/auth/login`, {
      statusCode: 401,
      body: { message: 'Usúario ou senha incorretos' },
    }).as('loginError');

    cy.visit('/login');

    cy.get('#email').type('joao@empresa.com');
    cy.get('#password').type('senha-errada');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginError');

    cy.contains('Usúario ou senha incorretos').should('exist');
    cy.url().should('include', '/login');
  });

  it('redirects to login when there is no session', () => {
    cy.visit('/boards/board-1');

    cy.url().should('include', '/login');
  });
});