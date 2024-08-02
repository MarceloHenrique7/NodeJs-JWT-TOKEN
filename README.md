Node.js JWT Token Authentication API
Esta é uma API Node.js que utiliza JWT para autenticação e realiza operações CRUD em usuários. A aplicação está hospedada em https://nodejs-jwt-token.onrender.com.

Sumário:

  Instalação
  Configuração
  Endpoints
  Tecnologias Utilizadas

Instalação
1.Clone o repositório:
  git clone https://github.com/seu-usuario/nodejs-jwt-token-authentication.git
2.Navegue até o diretório do projeto:
  cd nodejs-jwt-token-authentication
3.Instale as dependências:
  npm install
  
Configuração
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
  DB_USER=seu_usuario
  DB_PASS=sua_senha
  SECRET=sua_chave_secreta

Execute a aplicação em modo de produção:
  npm run production

  
Endpoints:
  Registro de Usuário
  URL: /auth/register
  
  Método: POST
  
  Body:
    {
    "name": "Seu Nome",
    "email": "seuemail@example.com",
    "password": "sua_senha",
    "confirmpassword": "sua_senha"
    }
  Login de Usuário
    URL: /auth/login
  
    Método: POST
  
    Body:
  
    json: {
      "email": "seuemail@example.com",
      "password": "sua_senha"
    }
    Obter Detalhes do Usuário
    
    URL: /user/:id
    Método: GET
    Headers: Authorization: Bearer {token}
    Atualizar Usuário
    URL: /user/:id
    
    Método: PUT
    
    Headers: Authorization: Bearer {token}
    
    Body:
    {
    "name": "Novo Nome",
    "email": "novoemail@example.com",
    "password": "nova_senha",
    "confirmpassword": "nova_senha"
    }

    Deletar Usuário
    URL: /user/:id
    Método: DELETE
    Headers: Authorization: Bearer {token}
    
Tecnologias Utilizadas:
  Node.js
  Express
  MongoDB
  Mongoose
  JWT (Json Web Token)
  Bcrypt
  Dotenv
  
Licença Este projeto está licenciado sob a licença MIT.
