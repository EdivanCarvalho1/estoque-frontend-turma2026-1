Feature: Cadastro de produto

Scenario: Cadastro com sucesso
  Given que estou na tela de cadastro
  When preencho os dados do produto
  And solicito o cadastro
  Then devo ver os dados do produto cadastrado com estoque = 0