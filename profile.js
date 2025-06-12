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

      // Adiciona o evento de clique ao novo botão de login
      const loginButton = document.getElementById('profile-login-btn');
      const modal = document.getElementById('auth-modal');

      if (loginButton && modal) {
        loginButton.addEventListener('click', () => {
          // Reutiliza a lógica do modal de autenticação existente
          const modalTitle = modal.querySelector("h2");
          const modalSubmitBtn = modal.querySelector('button[type="submit"]');

          if (modalTitle) modalTitle.textContent = "Login";
          if (modalSubmitBtn) modalSubmitBtn.textContent = "Entrar";

          modal.classList.remove("hidden");
        });
      }
    }
    return; // Impede a execução do resto do script
  }

  // Se ESTIVER logado, o código abaixo é executado normalmente
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find(user => user.email === userEmail);

  if (!currentUser) {
    // Caso de segurança: se o usuário logado não for encontrado nos dados
    window.location.href = 'index.html';
    return;
  }

  // Atualiza os elementos da página com os dados do usuário
  updateProfileAvatar(currentUser);
  updateProfileHeader(currentUser);
  updateProfileDetails(currentUser);
  updateEducationInfo(currentUser);
  setupProfileButtons(currentUser);
});

/**
 * Atualiza o avatar do usuário com as iniciais do nome
 */
function updateProfileAvatar(user) {
  const avatarElement = document.getElementById('profile-avatar');
  if (!avatarElement) return;

  // Obtém as iniciais do nome do usuário
  const initials = user.name
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  avatarElement.textContent = initials;

  // Adiciona uma cor de fundo aleatória baseada no email do usuário
  const colors = [
    '#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626',
    '#7C3AED', '#DB2777', '#2563EB', '#65A30D', '#0284C7'
  ];

  // Gera um índice baseado no email do usuário
  const colorIndex = user.email
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  avatarElement.style.backgroundColor = colors[colorIndex];
}

/**
 * Atualiza o cabeçalho do perfil com nome e email
 */
function updateProfileHeader(user) {
  const nameElement = document.getElementById('profile-name');
  const emailElement = document.getElementById('profile-email');
  const locationElement = document.getElementById('profile-location');

  if (nameElement) nameElement.textContent = `Olá, ${user.name}!`;
  if (emailElement) emailElement.textContent = user.email;

  // Atualiza a localização se disponível
  if (locationElement && user.address) {
    const city = user.address.city || '';
    const state = user.address.state || '';

    if (city && state) {
      locationElement.textContent = `${city}, ${state}`;
    } else if (city) {
      locationElement.textContent = city;
    } else if (state) {
      locationElement.textContent = state;
    } else {
      locationElement.textContent = 'Localização não informada';
    }
  } else if (locationElement) {
    locationElement.textContent = 'Localização não informada';
  }
}

/**
 * Atualiza os detalhes do perfil
 */
function updateProfileDetails(user) {
  const detailsElement = document.getElementById('profile-details');
  if (!detailsElement) return;

  let detailsHTML = '<ul class="nube-profile-details-list">';

  // Adiciona os dados pessoais
  if (user.birthDate) detailsHTML += `<li><strong>Data de Nascimento:</strong> ${user.birthDate}</li>`;
  if (user.gender) {
    let genderText = user.gender;
    if (user.gender === 'masculino') genderText = 'Masculino';
    else if (user.gender === 'feminino') genderText = 'Feminino';
    else if (user.gender === 'outro') genderText = 'Outro';
    else if (user.gender === 'nao_informar') genderText = 'Prefiro não informar';

    detailsHTML += `<li><strong>Gênero:</strong> ${genderText}</li>`;
  }
  if (user.cpf) detailsHTML += `<li><strong>CPF:</strong> ${user.cpf}</li>`;
  if (user.phone) detailsHTML += `<li><strong>Telefone:</strong> ${user.phone}</li>`;

  // Adiciona os dados de endereço
  if (user.address) {
    const address = user.address;
    let addressText = '';

    if (address.street) addressText += address.street;
    if (address.number) addressText += `, ${address.number}`;
    if (address.complement) addressText += ` - ${address.complement}`;
    if (address.city && address.state) addressText += `<br>${address.city}/${address.state}`;
    if (address.zipCode) addressText += ` - CEP: ${address.zipCode}`;

    if (addressText) detailsHTML += `<li><strong>Endereço:</strong> ${addressText}</li>`;
  }

  detailsHTML += '</ul>';

  // Atualiza o conteúdo do elemento
  detailsElement.innerHTML = detailsHTML;
}

/**
 * Atualiza as informações de educação
 */
function updateEducationInfo(user) {
  const educationElement = document.getElementById('profile-education');
  if (!educationElement) return;

  let educationHTML = '<ul class="nube-profile-education-list">';

  if (user.education) {
    const education = user.education;

    // Formata o nível de escolaridade
    let levelText = education.level || '';
    if (education.level === 'medio') levelText = 'Ensino Médio';
    else if (education.level === 'tecnico') levelText = 'Curso Técnico';
    else if (education.level === 'superior') levelText = 'Ensino Superior';

    // Formata o turno
    let shiftText = education.shift || '';
    if (education.shift === 'manha') shiftText = 'Manhã';
    else if (education.shift === 'tarde') shiftText = 'Tarde';
    else if (education.shift === 'noite') shiftText = 'Noite';

    // Adiciona as informações de educação
    if (levelText) educationHTML += `<li><strong>${levelText}</strong>`;
    if (education.course) educationHTML += ` - ${education.course}`;
    if (education.institution) educationHTML += `<br>${education.institution}`;
    if (education.period) educationHTML += ` (${education.period}`;
    if (shiftText) educationHTML += ` - ${shiftText})`;
    else if (education.period) educationHTML += `)`;
    educationHTML += '</li>';
  } else {
    educationHTML += '<li>Nenhuma informação acadêmica disponível</li>';
  }

  educationHTML += '</ul>';

  // Atualiza o conteúdo do elemento
  educationElement.innerHTML = educationHTML;
}

/**
 * Configura os botões da página de perfil
 */
function setupProfileButtons(user) {
  const editButton = document.getElementById('btn-edit-profile');
  const resumeButton = document.getElementById('btn-view-resume');

  if (editButton) {
    editButton.addEventListener('click', () => {
      alert('Funcionalidade de edição de perfil em desenvolvimento.');
    });
  }

  if (resumeButton) {
    resumeButton.addEventListener('click', () => {
      alert('Funcionalidade de visualização de currículo em desenvolvimento.');
    });
  }
}