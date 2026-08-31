Feature: Cadastro de pedido de produto

  Scenario: Cadastro de pedido com sucesso
    Given que estou na tela de cadastro de pedido
    When preencho um pedido válido com quantidade 2
    And solicito o cadastro do pedido
    Then devo ver os detalhes do pedido com quantidade 2 e status "opened"

  Scenario: Cadastro de pedido rejeitado por quantidade inválida
    Given que estou na tela de cadastro de pedido
    When preencho um pedido com quantidade 0
    And solicito o cadastro do pedido
    Then devo ver o erro de pedido "A quantidade do pedido deve ser maior que zero."
