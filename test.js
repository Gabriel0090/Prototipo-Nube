/**
 * test.js - Testes para o sistema de autenticação
 * 
 * Este arquivo contém funções para testar o sistema de autenticação.
 * Para usar, abra o console do navegador e execute as funções manualmente.
 */

// Função para limpar todos os dados de autenticação
function clearAuthData() {
  localStorage.removeItem('users');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedInUserEmail');
  console.log('✅ Dados de autenticação limpos com sucesso!');
}

// Função para criar um usuário de teste
function createTestUser() {
  const testUser = {
    email: 'teste@exemplo.com',
    password: 'senha123',
    name: 'Usuário de Teste',
    birthDate: '2000-01-01',
    gender: 'masculino',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    address: {
      zipCode: '01234-567',
      street: 'Rua de Teste',
      number: '123',
      complement: 'Apto 456',
      city: 'São Paulo',
      state: 'SP'
    },
    education: {
      level: 'superior',
      institution: 'Universidade de Teste',
      course: 'Ciência da Computação',
      period: '3º Semestre',
      shift: 'noite'
    }
  };
  
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUserIndex = users.findIndex(u => u.email === testUser.email);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = testUser;
    console.log('✅ Usuário de teste atualizado com sucesso!');
  } else {
    users.push(testUser);
    console.log('✅ Usuário de teste criado com sucesso!');
  }
  
  localStorage.setItem('users', JSON.stringify(users));
  
  return testUser;
}

// Função para simular login com o usuário de teste
function loginTestUser() {
  const testUser = createTestUser();
  
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('loggedInUserEmail', testUser.email);
  
  console.log('✅ Login do usuário de teste realizado com sucesso!');
  console.log('ℹ️ Recarregue a página para ver as mudanças na interface.');
}

// Função para simular logout
function logoutTestUser() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedInUserEmail');
  
  console.log('✅ Logout do usuário de teste realizado com sucesso!');
  console.log('ℹ️ Recarregue a página para ver as mudanças na interface.');
}

// Função para listar todos os usuários cadastrados
function listAllUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users.length === 0) {
    console.log('ℹ️ Nenhum usuário cadastrado.');
    return;
  }
  
  console.log(`ℹ️ Total de usuários cadastrados: ${users.length}`);
  
  users.forEach((user, index) => {
    console.log(`\nUsuário #${index + 1}:`);
    console.log(`Nome: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Senha: ${user.password}`);
    
    if (user.birthDate) console.log(`Data de Nascimento: ${user.birthDate}`);
    if (user.gender) console.log(`Gênero: ${user.gender}`);
    if (user.cpf) console.log(`CPF: ${user.cpf}`);
    if (user.phone) console.log(`Telefone: ${user.phone}`);
    
    if (user.address) {
      console.log('\nEndereço:');
      if (user.address.street) console.log(`  Rua: ${user.address.street}`);
      if (user.address.number) console.log(`  Número: ${user.address.number}`);
      if (user.address.complement) console.log(`  Complemento: ${user.address.complement}`);
      if (user.address.city) console.log(`  Cidade: ${user.address.city}`);
      if (user.address.state) console.log(`  Estado: ${user.address.state}`);
      if (user.address.zipCode) console.log(`  CEP: ${user.address.zipCode}`);
    }
    
    if (user.education) {
      console.log('\nEducação:');
      if (user.education.level) console.log(`  Nível: ${user.education.level}`);
      if (user.education.institution) console.log(`  Instituição: ${user.education.institution}`);
      if (user.education.course) console.log(`  Curso: ${user.education.course}`);
      if (user.education.period) console.log(`  Período: ${user.education.period}`);
      if (user.education.shift) console.log(`  Turno: ${user.education.shift}`);
    }
  });
}

// Função para verificar o estado atual de autenticação
function checkAuthState() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('loggedInUserEmail');
  
  console.log(`ℹ️ Estado de login: ${isLoggedIn ? 'Logado' : 'Não logado'}`);
  
  if (isLoggedIn && userEmail) {
    console.log(`ℹ️ Email do usuário logado: ${userEmail}`);
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.email === userEmail);
    
    if (currentUser) {
      console.log(`ℹ️ Nome do usuário logado: ${currentUser.name}`);
    } else {
      console.log('⚠️ Usuário logado não encontrado na lista de usuários!');
    }
  }
}

// Instruções de uso
console.log('=== TESTES DO SISTEMA DE AUTENTICAÇÃO ===');
console.log('Para testar o sistema, execute as seguintes funções no console:');
console.log('- clearAuthData(): Limpa todos os dados de autenticação');
console.log('- createTestUser(): Cria um usuário de teste');
console.log('- loginTestUser(): Simula login com o usuário de teste');
console.log('- logoutTestUser(): Simula logout');
console.log('- listAllUsers(): Lista todos os usuários cadastrados');
console.log('- checkAuthState(): Verifica o estado atual de autenticação');
console.log('=======================================');

