# USER SERVICE API

## Esta API representa o segundo projeto do 4º quarter. Neste projeto estruturamos rotas básicas de Login, Cadastro e Consulta, além de poder alterar seus próprios dados.

<hr/>

## Link do Repositótio Original.

Use o repositório Original para criar o seu código. _[User Service API](https://github.com/Kenzie-Academy-Brasil-Developers/q4-sprint1-users-service)_

### Importante Instalar o Express e fazer as configuraçãos nescessárias:

```bash
yarn init -y

yarn add express

yarn add -D nodemon
```

### Configuração no Package.json

```javascript
{
  "name": "projeto-node",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",

  "scripts": {
    "dev": "nodemon index.js"
  },

  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

## Routes

| Tipo da Rota | Valor do exemplo      | Descrição                                                                                        |
| ------------ | --------------------- | ------------------------------------------------------------------------------------------------ |
| GET          | /users                | Listar os usuários                                                                               |
| POST         | /login                | Gera um token JWT recebendo username e password no corpo da requisição como JSON.                |
| POST         | /signup               | Criação de usuários                                                                              |
| PUT          | /users/:uuid/password | Atualiza a senha do usuário, recebendo uma string e gerando a hash novamente para a nova string. |
|              |

## Obrigado por visitar meu projeto. [Linkedin](https://www.linkedin.com/in/flaviopsantos/)
