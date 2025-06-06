# Sistema de Login e Cadastro - Nube Fácil

Este documento descreve a implementação do sistema de login e cadastro para o site Nube Fácil, utilizando JavaScript e localStorage.

## Funcionalidades Implementadas

1. **Cadastro de Usuários**
   - Armazenamento de dados no localStorage
   - Validação de email e senha
   - Coleta de informações pessoais, endereço e educação

2. **Login de Usuários**
   - Validação de credenciais
   - Manutenção do estado de login no localStorage
   - Redirecionamento para a página de perfil após login bem-sucedido

3. **Atualização da Interface**
   - Exibição/ocultação de botões de login/cadastro baseado no estado de login
   - Adição dinâmica do botão de logout
   - Prevenção de duplicação de elementos na interface

4. **Página de Perfil**
   - Exibição das informações do usuário logado
   - Avatar com iniciais do usuário
   - Detalhes pessoais, endereço e formação acadêmica
   - Proteção da página para usuários não logados

## Estrutura de Arquivos

- **auth.js**: Implementação principal do sistema de autenticação
- **profile.js**: Funcionalidades específicas para a página de perfil
- **script.js**: Script original do site, modificado para integrar com o sistema de autenticação

## Como Testar

### Cadastro de Usuário

1. Acesse a página inicial do site
2. Clique no botão "Cadastre-se"
3. Você será redirecionado para a página de cadastro
4. Preencha o formulário com seus dados
5. Clique em "Finalizar Cadastro"
6. Você será automaticamente logado e redirecionado para a página inicial

### Login de Usuário

1. Acesse a página inicial do site
2. Clique no botão "Login"
3. Digite seu email e senha no modal que aparece
4. Clique em "Entrar"
5. Você será redirecionado para a página de perfil

### Logout

1. Quando logado, um botão "Sair" aparecerá no lugar dos botões de login/cadastro
2. Clique neste botão para fazer logout
3. Você será redirecionado para a página inicial

### Página de Perfil

1. Quando logado, acesse a página de perfil clicando em "Meu Perfil" no menu
2. Você verá suas informações pessoais, endereço e formação acadêmica
3. Se tentar acessar esta página sem estar logado, será redirecionado para a página inicial

## Estrutura de Dados no localStorage

O sistema utiliza duas chaves principais no localStorage:

1. **users**: Array de objetos contendo os dados dos usuários cadastrados
   ```javascript
   [
     {
       email: "usuario@exemplo.com",
       password: "senha123",
       name: "Nome do Usuário",
       // outros dados do usuário...
     },
     // outros usuários...
   ]
   ```

2. **isLoggedIn**: Booleano indicando se há um usuário logado
   ```javascript
   "true" ou "false"
   ```

3. **loggedInUserEmail**: Email do usuário atualmente logado
   ```javascript
   "usuario@exemplo.com"
   ```

## Limitações e Melhorias Futuras

1. **Segurança**: O armazenamento de senhas em texto plano no localStorage não é seguro para um ambiente de produção. Em uma implementação real, seria necessário utilizar um backend com autenticação segura.

2. **Persistência**: Os dados armazenados no localStorage são específicos do navegador e podem ser perdidos se o usuário limpar os dados de navegação.

3. **Funcionalidades Adicionais**:
   - Recuperação de senha
   - Edição de perfil
   - Validação mais robusta de formulários
   - Proteção de rotas para páginas que requerem autenticação

## Notas de Implementação

- A implementação foi feita sem alterar a estrutura HTML/CSS existente
- O código foi organizado de forma modular para facilitar manutenção futura
- Foram adicionados comentários explicativos em todo o código

