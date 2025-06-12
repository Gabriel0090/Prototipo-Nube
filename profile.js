
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o usuário está logado
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('loggedInUserEmail');
  
  // Seletores para os elementos da página de perfil
  const profileCard = document.querySelector('.nube-profile-card');
  const sectionContainer = document.querySelector('.nube-content-section .nube-container');
  const sectionTitle = document.querySelector('.nube-section-title');

  if (!isLoggedIn || !userEmail) {
    // Se NÃO estiver logado, mostra o prompt de login
    if (profileCard) {
      profileCard.style.display = 'none'; // Esconde o card de perfil original
    }
    
    if (sectionContainer && sectionTitle) {
      sectionTitle.textContent = 'Acesso ao Perfil'; // Muda o título da seção

      // Cria o elemento de prompt de login
      const loginPrompt = document.createElement('div');
      loginPrompt.className = 'text-center p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto'; // Estilo do card
      loginPrompt.innerHTML = `
        <h3 class="text-xl font-semibold mb-4">Você precisa estar logado para ver esta página.</h3>
        <p class="text-gray-600 mb-6">Faça o login para acessar suas informações, candidaturas e muito mais.</p>
        <button id="profile-login-btn" class="nube-btn-primary px-8 py-3">Fazer Login</button>
      `;

      sectionContainer.appendChild(loginPrompt); // Adiciona o prompt à página

      // Adiciona o evento de clique ao novo botão de login para abrir o modal
      const loginButton = document.getElementById('profile-login-btn');
      const modal = document.getElementById('auth-modal');
      
      if (loginButton && modal) {
        loginButton.addEventListener('click', () => {
          modal.querySelector("h2").textContent = "Login";
          modal.querySelector('button[type="submit"]').textContent = "Entrar";
          modal.classList.remove("hidden");
        });
      }
    }
    return; // Impede a execução do resto do script
  }
  
  // Se ESTIVER logado, o código abaixo é executado para carregar os dados
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find(user => user.email === userEmail);
  
  if (!currentUser) {
    // Medida de segurança
    window.location.href = 'index.html';
    return;
  }
  
  updateProfileAvatar(currentUser);
  updateProfileHeader(currentUser);
  updateProfileDetails(currentUser);
  updateEducationInfo(currentUser);
  setupProfileButtons(currentUser);
});

function updateProfileAvatar(user) {
  const avatarElement = document.getElementById('profile-avatar');
  if (!avatarElement) return;
  
  const initials = user.name.split(' ').map(name => name.charAt(0).toUpperCase()).slice(0, 2).join('');
  avatarElement.textContent = initials;
  
  const colors = ['#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777', '#2563EB', '#65A30D', '#0284C7'];
  const colorIndex = user.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  avatarElement.style.backgroundColor = colors[colorIndex];
}

function updateProfileHeader(user) {
  const nameElement = document.getElementById('profile-name');
  const emailElement = document.getElementById('profile-email');
  const locationElement = document.getElementById('profile-location');
  
  if (nameElement) nameElement.textContent = `Olá, ${user.name}!`;
  if (emailElement) emailElement.textContent = user.email;
  
  if (locationElement && user.address) {
    const { city = '', state = '' } = user.address;
    locationElement.textContent = (city && state) ? `${city}, ${state}` : (city || state || 'Localização não informada');
  } else if (locationElement) {
    locationElement.textContent = 'Localização não informada';
  }
}

function updateProfileDetails(user) {
  const detailsElement = document.getElementById('profile-details');
  if (!detailsElement) return;
  
  let detailsHTML = '<ul class="nube-profile-details-list">';
  if (user.birthDate) detailsHTML += `<li><strong>Data de Nascimento:</strong> ${user.birthDate}</li>`;
  if (user.gender) {
    const genderMap = { masculino: 'Masculino', feminino: 'Feminino', outro: 'Outro', nao_informar: 'Prefiro não informar' };
    detailsHTML += `<li><strong>Gênero:</strong> ${genderMap[user.gender] || user.gender}</li>`;
  }
  if (user.cpf) detailsHTML += `<li><strong>CPF:</strong> ${user.cpf}</li>`;
  if (user.phone) detailsHTML += `<li><strong>Telefone:</strong> ${user.phone}</li>`;
  if (user.address) {
    const { street, number, complement, city, state, zipCode } = user.address;
    let addressText = [street, number, complement].filter(Boolean).join(', ');
    if (city && state) addressText += `<br>${city}/${state}`;
    if (zipCode) addressText += ` - CEP: ${zipCode}`;
    if (addressText) detailsHTML += `<li><strong>Endereço:</strong> ${addressText}</li>`;
  }
  detailsHTML += '</ul>';
  detailsElement.innerHTML = detailsHTML;
}

function updateEducationInfo(user) {
  const educationElement = document.getElementById('profile-education');
  if (!educationElement) return;
  
  let educationHTML = '<ul class="nube-profile-education-list">';
  if (user.education) {
    const { level, course, institution, period, shift } = user.education;
    const levelMap = { medio: 'Ensino Médio', tecnico: 'Curso Técnico', superior: 'Ensino Superior' };
    const shiftMap = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' };
    
    let educationText = `<li><strong>${levelMap[level] || level}</strong>`;
    if (course) educationText += ` - ${course}`;
    if (institution) educationText += `<br>${institution}`;
    if (period || shift) educationText += ` (${[period, shiftMap[shift]].filter(Boolean).join(' - ')})`;
    educationText += '</li>';
    educationHTML += educationText;
  } else {
    educationHTML += '<li>Nenhuma informação acadêmica disponível</li>';
  }
  educationHTML += '</ul>';
  educationElement.innerHTML = educationHTML;
}

function setupProfileButtons(user) {
  const editButton = document.getElementById('btn-edit-profile');
  const resumeButton = document.getElementById('btn-view-resume');
  
  if (editButton) editButton.addEventListener('click', () => alert('Funcionalidade de edição de perfil em desenvolvimento.'));
  if (resumeButton) resumeButton.addEventListener('click', () => alert('Funcionalidade de visualização de currículo em desenvolvimento.'));
}