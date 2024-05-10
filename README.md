<p align="center">
  <img src="https://img.shields.io/badge/node-v18.18.2-339933?style=flat&logo=nodedotjs&logoColor=%23339933" />
  <img src="https://img.shields.io/badge/npm-v9.8.1-CB3837?style=flat&logo=npm" />
  <img src="https://img.shields.io/badge/feito_por-Carlos_Faustino-black" />
</p>

<br/>

# :bulb: Sobre

GymPass Style App desenvolvido no módulo sobre API REST da formação de Node.js da Rocketseat.

## :page_with_curl: Pré-requisitos

1. Antes de começar, certifique-se de ter o Node.js instalado em sua máquina. 
    <a href="https://nodejs.org">
      <img width="24" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/>
    </a>

## :gear: Configuração

1. Clone o repositório para sua máquina local:

```bash
git clone https://github.com/carlos-hfc/api-rest-nodejs
```

2. Acesse o diretório do projeto:

```bash
cd api-rest-nodejs
```

3. Instale as dependências:

```bash
npm install
```

4. Crie um arquivo `.env.local` na raiz do projeto e adicione as seguinte chaves:

```env
NODE_ENV=""
DATABASE_URL=""
```

5. Rode a aplicação

```bash
npm run dev
```

## :computer_mouse: Features

### Requisitos funcionais

- :ballot_box_with_check: Deve ser possível se cadastrar
- :ballot_box_with_check: Deve ser possível se autenticar
- :ballot_box_with_check: Deve ser possível obter o perfil de um usuário logado
- :white_large_square: Deve ser possível obter o número de check-ins realizados pelo usuário logado
- :white_large_square: Deve ser possível o usúario obter o seu histórico de check-ins
- :white_large_square: Deve ser possível o usuário buscar academias próximas (até 10km)
- :white_large_square: Deve ser possível o usuário buscar academias pelo nome
- :white_large_square: Deve ser possível o usuário realizar o check-in em uma academia
- :white_large_square: Deve ser possível validar o check-in de um usuário
- :white_large_square: Deve ser possível cadastrar uma academia

### Regras de negócio

- :ballot_box_with_check: O usuário não deve se cadastar com um e-mail duplicado
- :white_large_square: O usuário não pode fazer 2 check-ins no mesmo dia
- :white_large_square: O usuário não pode fazer check-in se não estiver perto (100m) da academia
- :white_large_square: O check-in só pode ser validado até 20 minutos após ser criado
- :white_large_square: O check-in só poder validado por administradores
- :white_large_square: A academia só pode ser cadastrada por administradores

### Requisitos não funcionais

- :ballot_box_with_check: A senha do usuário precisa estar criptografada
- :ballot_box_with_check: Os dados da aplicação precisam estar persistidos em um branco PostgreSQL
- :white_large_square: Todas as listas de dadaos precisam estar paginadas com 20 itens por página
- :white_large_square: O usuário deve ser identificado por um JWT (JSON Web Token)

## :computer: Tecnologias utilizadas

<p float="left">
  <img width="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/>
  <img width="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/>
</p>

## :page_facing_up: Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).