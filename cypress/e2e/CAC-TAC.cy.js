describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche campos obrigatorios e envia formulario', () => {
    let elogio = Cypress._.repeat('asdf', 20)

    cy.get('#firstName').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('#email').type('John@Doe.zz')
    cy.get('#open-text-area').type(elogio, { delay: 0 })

    cy.contains('button', 'Enviar').click()
    
    cy.get('.success')
      .should('be.visible')
      .contains('Mensagem enviada com sucesso.')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('#email').type('invalid-email.zzz')
    cy.get('#open-text-area').type('Este é um elogio')

    cy.contains('button', 'Enviar').click()
    
    cy.get('.error')
      .should('be.visible')
      .contains('Valide os campos obrigatórios!')
  })

  it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
    cy.get('#phone')
      .type('abcde')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário',() => {
    cy.get('#firstName').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('#email').type('John@Doe.zzz')
    cy.get('#open-text-area').type('Este é um elogio')
    cy.get('#phone-checkbox').check()
    cy.contains('button', 'Enviar').click()
    
    cy.get('.error')
      .should('be.visible')
      .contains('Valide os campos obrigatórios!')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('John').should('have.value', 'John')
    cy.get('#lastName').type('Doe').should('have.value', 'Doe')
    cy.get('#email').type('John@Doe.zzz').should('have.value', 'John@Doe.zzz')
    cy.get('#phone').type('123456789').should('have.value', '123456789')
    cy.get('#open-text-area').type('Este é um elogio')

    cy.get('#firstName').clear().should('have.value', '')
    cy.get('#lastName').clear().should('have.value', '')
    cy.get('#email').clear().should('have.value', '')
    cy.get('#phone').clear().should('have.value', '')
    cy.get('#open-text-area').clear().should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click()

    cy.get('.error')
      .should('be.visible')
      .contains('Valide os campos obrigatórios!')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
     cy.fillMandatoryFieldsAndSubmit({ firstName: 'John', lastName: 'Doe', email: 'John@Doe.zzz', message: 'Este é um elogio' })

    cy.get('.success')
      .should('be.visible')
      .contains('Mensagem enviada com sucesso.')
  })
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('be.checked')
  })
  
  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]').each((atendimento) => { 
      cy.wrap(atendimento)
        .check()
        .should('be.checked')
    })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type=checkbox]').each((contato) => {
      cy.wrap(contato)
        .check()
        .should('be.checked')
    })

    cy.get('input[type=checkbox]')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('marca ambos checkboxes, depois desmarca o último v2', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('selefctFile', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should( input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .selectFile('@sampleFile')
      .should( input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('API', () => {
    cy.request('GET', '/').then( response => {
      expect(response.status).to.equal(200)
      console.log(response.body)
    })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy > a')
    .should('have.attr', 'target', '_blank')
      
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy > a')
      .invoke('removeAttr', 'target')
      .click()
      
    cy.contains('h1', 'CAC TAT - Política de Privacidade')
  })

  it('testa a página da política de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')
    
    cy.contains('h1', 'CAC TAT - Política de Privacidade').should('be.visible')
  })
})
