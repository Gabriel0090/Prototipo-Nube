// ================================
// 🔹 MENU MOBILE RESPONSIVO
// ================================
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('nube-mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');

let closeMenu = () => { };

if (mobileMenuToggle && mobileNav && mobileNavOverlay && mobileMenuClose) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileNav.classList.add('is-open');
    mobileNavOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileMenuClose.focus();
  });

  closeMenu = () => {
    mobileNav.classList.remove('is-open');
    mobileNavOverlay.style.display = 'none';
    document.body.style.overflow = '';
    mobileNav.setAttribute('aria-hidden', 'true');
    if (document.activeElement === mobileMenuClose || mobileNav.contains(document.activeElement)) {
      mobileMenuToggle.focus();
    }
  };

  mobileMenuClose.addEventListener('click', closeMenu);
  mobileNavOverlay.addEventListener('click', closeMenu);
}

// ================================
// 🔹 MODAL DE LOGIN / CADASTRO
// ================================
const modal = document.getElementById('auth-modal');
const openAuthModalButtons = document.querySelectorAll(
  '.nube-btn-login, .nube-btn-register, .nube-btn-login_header, .nube-btn-register_header'
);
const closeAuthModalBtn = document.getElementById('close-auth-modal');
const authForm = document.getElementById('register-form');

if (modal && closeAuthModalBtn && authForm) {
  openAuthModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');

      if (mobileNav.classList.contains('is-open')) {
        closeMenu();
      }

      const firstFocusable = modal.querySelector('input, button');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    });
  });

  closeAuthModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
}

// ================================
// 🔹 FUNÇÃO DE LOGIN FUNCIONAL
// ================================
function loginUsuario(email, senha) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuarioValido = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuarioValido) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));
    alert('Login realizado com sucesso!');
    window.location.href = 'index.html';
  } else {
    alert('E-mail ou senha inválidos.');
  }
}

// ================================
// 🔹 SUBMISSÃO DO FORMULÁRIO DE LOGIN
// ================================
if (authForm) {
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = authForm.email.value.trim();
    const senha = authForm.senha.value;
    loginUsuario(email, senha);
  });
}

// ================================
// 🔹 BOTÃO DE FINALIZAR (opcional)
// ================================
const btnFinalizar = document.getElementById('btnFinalizar');
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}
// ... (código script.js existente) ...

document.addEventListener('DOMContentLoaded', () => {
  // ... (código DOMContentLoaded existente como envio de formulário para cadastroForm se ainda estiver lá) ...

  // --- Funcionalidade de Pesquisa ---
  const searchPageForm = document.querySelector('.nube-search-bar'); // Assume que isso é único o suficiente ou segmente mais especificamente
  const vacancyCardGrid = document.querySelector('.nube-card-grid');
  const allVacancyCards = vacancyCardGrid ? Array.from(vacancyCardGrid.querySelectorAll('.nube-vaga-card')) : [];

  if (searchPageForm && vacancyCardGrid) {
    const cargoInput = searchPageForm.querySelector('input[placeholder="Cargo, palavra-chave ou empresa"]');
    const localidadeInput = searchPageForm.querySelector('input[placeholder="Localidade (Cidade/Estado)"]');
    const searchButton = searchPageForm.querySelector('.nube-search-button');

    function filterVacancies() {
      const cargoTerm = cargoInput.value.toLowerCase().trim();
      const localidadeTerm = localidadeInput.value.toLowerCase().trim();

      allVacancyCards.forEach(card => {
        const title = card.querySelector('.nube-vaga-title')?.textContent.toLowerCase() || '';
        const company = card.querySelector('.nube-vaga-empresa')?.textContent.toLowerCase() || '';
        const location = card.querySelector('.nube-vaga-location')?.textContent.toLowerCase() || '';

        const matchesCargo = !cargoTerm || title.includes(cargoTerm) || company.includes(cargoTerm);
        const matchesLocalidade = !localidadeTerm || location.includes(localidadeTerm);

        if (matchesCargo && matchesLocalidade) {
          card.style.display = ''; // Mostrar card
        } else {
          card.style.display = 'none'; // Ocultar card
        }
      });
    }

    if (searchButton) {
      searchButton.addEventListener('click', filterVacancies);
    }
    // Opcional: filtrar enquanto o usuário digita
    // if (cargoInput) cargoInput.addEventListener('keyup', filterVacancies);
    // if (localidadeInput) localidadeInput.addEventListener('keyup', filterVacancies);

    // Preencher pesquisa a partir de parâmetros da URL se vier de index.html
    const urlParams = new URLSearchParams(window.location.search);
    const queryCargo = urlParams.get('cargo');
    const queryLocalidade = urlParams.get('localidade');

    if (cargoInput && queryCargo) {
      cargoInput.value = queryCargo;
    }
    if (localidadeInput && queryLocalidade) {
      localidadeInput.value = queryLocalidade;
    }
    if (queryCargo || queryLocalidade) {
      filterVacancies(); // Auto-pesquisa se os parâmetros estiverem presentes
    }
  }

  // --- Barra de Pesquisa do Herói de Index.html ---
  const heroSearchBar = document.querySelector('.nube-hero-section .nube-search-bar');
  if (heroSearchBar) {
    const heroCargoInput = heroSearchBar.querySelector('input[placeholder="Cargo, palavra-chave ou empresa"]');
    const heroLocalidadeInput = heroSearchBar.querySelector('input[placeholder="Localidade (Cidade/Estado)"]');
    const heroSearchButton = heroSearchBar.querySelector('.nube-search-button');

    if (heroSearchButton) {
      heroSearchButton.addEventListener('click', () => {
        const cargo = heroCargoInput.value.trim();
        const localidade = heroLocalidadeInput.value.trim();
        window.location.href = `search.html?cargo=${encodeURIComponent(cargo)}&localidade=${encodeURIComponent(localidade)}`;
      });
    }
  }

  // ... (restante do código script.js existente para modal, menu móvel, etc.) ...
  // Garanta que as atualizações da UI de login/logout também estejam dentro do DOMContentLoaded ou sejam chamadas apropriadamente
  updateLoginUI();
});

// ... (funções existentes para menu móvel, modal, etc.) ...

// --- Função de Atualização da UI de Login/Logout (será expandida posteriormente) ---
function updateLoginUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('loggedInUserEmail');

  // Selecionar todos os botões relevantes (cabeçalho, navegação móvel)
  const loginButtons = document.querySelectorAll('.nube-btn-login, .nube-btn-login_header');
  const registerButtons = document.querySelectorAll('.nube-btn-register, .nube-btn-register_header');

  const navLinks = document.querySelectorAll('.nube-main-nav a, .nube-mobile-nav a');
  const profileLinkDesktop = document.querySelector('.nube-main-nav a[href="profile.html"]');
  const profileLinkMobile = document.querySelector('.nube-mobile-nav a[href="profile.html"]');

  // Placeholder para botão de logout e texto dinâmico do link do perfil
  // Estes serão adicionados dinamicamente se não existirem ou modificados

  if (isLoggedIn) {
    loginButtons.forEach(btn => btn.style.display = 'none');
    registerButtons.forEach(btn => btn.style.display = 'none');

    // Mostrar "Meu Perfil" e adicionar "Sair"
    // Esta parte precisa de um tratamento cuidadoso de onde inserir o botão "Sair"
    // Por simplicidade, assumiremos que os links do perfil estão sempre lá e apenas garantiremos que estejam visíveis
    if (profileLinkDesktop) profileLinkDesktop.style.display = '';
    if (profileLinkMobile) profileLinkMobile.style.display = '';

    // Adicionar/Mostrar Botão de Logout (Exemplo: Anexando à navegação principal e navegação móvel)
    addLogoutButton('.nube-main-nav', 'nube-btn-logout-header', userEmail);
    addLogoutButton('.nube-mobile-auth-buttons', 'nube-btn-logout-mobile', userEmail);


  } else {
    loginButtons.forEach(btn => btn.style.display = ''); // Ou 'flex' se forem itens flex
    registerButtons.forEach(btn => btn.style.display = '');

    // Ocultar "Meu Perfil" se for apenas para usuários logados (ou gerenciar seu texto)
    // Remover botões de Logout
    removeLogoutButton('.nube-btn-logout-header');
    removeLogoutButton('.nube-btn-logout-mobile');
  }
}

function addLogoutButton(parentSelector, buttonClass, userEmail) {
  if (document.querySelector(`.${buttonClass}`)) return; // Já existe

  const parentElement = document.querySelector(parentSelector);
  if (parentElement) {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = `Sair (${userEmail ? userEmail.split('@')[0] : ''})`;
    logoutButton.classList.add(buttonClass); // Adicionar uma classe para estilização e remoção
    // Aplicar estilização semelhante a outros botões do cabeçalho
    logoutButton.style.padding = '0.5rem 1.25rem';
    logoutButton.style.borderRadius = '9999px';
    logoutButton.style.border = '1px solid #9ca3af';
    logoutButton.style.color = '#374151';
    logoutButton.style.fontWeight = '500';
    logoutButton.style.marginLeft = '1rem'; // Para navegação de desktop
    if (parentSelector === '.nube-mobile-auth-buttons') {
      logoutButton.style.width = '100%';
      logoutButton.style.textAlign = 'center';
      logoutButton.style.marginTop = '0.5rem';
    }


    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loggedInUserEmail');
      // Potencialmente remover outros dados específicos do usuário
      updateLoginUI();
      window.location.href = 'index.html'; // Redirecionar para a página inicial ou de login
    });
    parentElement.appendChild(logoutButton);
  }
}

function removeLogoutButton(buttonSelector) {
  const logoutButton = document.querySelector(buttonSelector);
  if (logoutButton) {
    logoutButton.remove();
  }
}

// Chamada inicial para definir a UI com base no estado de login
// Chame isso no final do DOMContentLoaded ou garanta que todos os elementos sejam carregados
// Chamada updateLoginUI() movida para o final do DOMContentLoaded
// Em script.js, dentro do ouvinte de evento DOMContentLoaded para a lógica de search.html:

document.addEventListener('DOMContentLoaded', () => {
  // ... (DOMContentLoaded existente para menu móvel, modal de autenticação etc.)

  const isOnSearchPage = window.location.pathname.includes('search.html');
  const isOnIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.includes('index.html');


  // --- Função para criar um HTML de card de vaga ---
  function createVacancyCardHTML(vacancy) {
    return `
            <div class="nube-vaga-card" data-id="${vacancy.id || ''}">
                <h3 class="nube-vaga-title">${vacancy.title}</h3>
                <p class="nube-vaga-empresa">${vacancy.company}</p>
                <p class="nube-vaga-location">${vacancy.location}</p>
                ${vacancy.description ? `<p class="text-sm text-gray-600 mb-2">${vacancy.description}</p>` : ''}
                <ul class="nube-vaga-details-list">
                    ${vacancy.salary ? `<li>Bolsa: ${vacancy.salary}</li>` : ''}
                    ${vacancy.workload ? `<li>Carga horária: ${vacancy.workload}</li>` : ''}
                    ${vacancy.benefits && vacancy.benefits.length > 0 && vacancy.benefits[0] !== "" ? `<li>Benefícios: ${vacancy.benefits.join(', ')}</li>` : ''}
                </ul>
                <div class="nube-vaga-footer-meta">
                    <button class="nube-btn-details">Ver Detalhes</button>
                    <span class="nube-vaga-date-posted">${vacancy.datePosted || 'Data não informada'}</span>
                </div>
            </div>
        `;
  }

  let allVacancyCards = []; // Inicializar ou redefinir isso para ser dinâmico

  // --- Funcionalidade de Pesquisa e Carregamento Dinâmico de Vagas (para search.html) ---
  if (isOnSearchPage) {
    const searchPageForm = document.querySelector('.nube-search-bar');
    const vacancyCardGrid = document.querySelector('.nube-card-grid');

    // Carregar cards estáticos inicialmente presentes no HTML
    const staticVacancyCards = vacancyCardGrid ? Array.from(vacancyCardGrid.querySelectorAll('.nube-vaga-card')) : [];
    allVacancyCards = [...staticVacancyCards]; // Começar com cards estáticos

    // Carregar vagas do localStorage
    const storedVacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
    if (vacancyCardGrid && storedVacancies.length > 0) {
      storedVacancies.forEach(vacancy => {
        // Evitar readicionar se o card já estiver no HTML estático (ex: verificando um ID se você tivesse um)
        // Por simplicidade, apenas anexaremos. Se você tiver IDs, pode verificar.
        const cardHTML = createVacancyCardHTML(vacancy);
        vacancyCardGrid.insertAdjacentHTML('beforeend', cardHTML);
      });
      // Repopular allVacancyCards para incluir os adicionados dinamicamente
      allVacancyCards = Array.from(vacancyCardGrid.querySelectorAll('.nube-vaga-card'));
    }


    if (searchPageForm && vacancyCardGrid) {
      const cargoInput = searchPageForm.querySelector('input[placeholder="Cargo, palavra-chave ou empresa"]');
      const localidadeInput = searchPageForm.querySelector('input[placeholder="Localidade (Cidade/Estado)"]');
      const searchButton = searchPageForm.querySelector('.nube-search-button');

      function filterVacancies() {
        const cargoTerm = cargoInput.value.toLowerCase().trim();
        const localidadeTerm = localidadeInput.value.toLowerCase().trim();

        allVacancyCards.forEach(card => {
          const title = card.querySelector('.nube-vaga-title')?.textContent.toLowerCase() || '';
          const company = card.querySelector('.nube-vaga-empresa')?.textContent.toLowerCase() || '';
          const location = card.querySelector('.nube-vaga-location')?.textContent.toLowerCase() || '';
          const description = card.querySelector('p.text-sm.text-gray-600')?.textContent.toLowerCase() || '';


          const matchesCargo = !cargoTerm || title.includes(cargoTerm) || company.includes(cargoTerm) || description.includes(cargoTerm);
          const matchesLocalidade = !localidadeTerm || location.includes(localidadeTerm);

          if (matchesCargo && matchesLocalidade) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }

      if (searchButton) {
        searchButton.addEventListener('click', filterVacancies);
      }
      if (cargoInput) cargoInput.addEventListener('input', filterVacancies); // Filtrar enquanto o usuário digita
      if (localidadeInput) localidadeInput.addEventListener('input', filterVacancies);


      const urlParams = new URLSearchParams(window.location.search);
      const queryCargo = urlParams.get('cargo');
      const queryLocalidade = urlParams.get('localidade');

      if (cargoInput && queryCargo) {
        cargoInput.value = queryCargo;
      }
      if (localidadeInput && queryLocalidade) {
        localidadeInput.value = queryLocalidade;
      }
      if (queryCargo || queryLocalidade) {
        filterVacancies();
      }
    }
  }

  // --- Barra de Pesquisa do Herói de Index.html ---
  if (isOnIndexPage) {
    const heroSearchBar = document.querySelector('.nube-hero-section .nube-search-bar');
    if (heroSearchBar) {
      const heroCargoInput = heroSearchBar.querySelector('input[placeholder="Cargo, palavra-chave ou empresa"]');
      const heroLocalidadeInput = heroSearchBar.querySelector('input[placeholder="Localidade (Cidade/Estado)"]');
      const heroSearchButton = heroSearchBar.querySelector('.nube-search-button');

      if (heroSearchButton) {
        heroSearchButton.addEventListener('click', () => {
          const cargo = heroCargoInput.value.trim();
          const localidade = heroLocalidadeInput.value.trim();
          window.location.href = `search.html?cargo=${encodeURIComponent(cargo)}&localidade=${encodeURIComponent(localidade)}`;
        });
      }
    }
  }

  // Tratamento de Formulário de Login/Registro (se ainda estiver em cadastro.html ou similar)
  const studentRegistrationForm = document.getElementById('cadastroForm');
  if (studentRegistrationForm) {
    studentRegistrationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // ... validação existente ...
      const userEmail = this.email.value;
      const userPassword = this.senha.value; // Supondo que 'senha' seja o nome do campo de senha

      if (userEmail && userPassword) {
        // Armazenar usuário (simplificado: sobrescreve se o e-mail existir ou adiciona novo)
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUserIndex = users.findIndex(u => u.email === userEmail);
        const newUser = {
          email: userEmail,
          password: userPassword, // Em um aplicativo real, FAÇA HASH DA SENHA!
          name: this.nome.value,
          // ... outros campos ...
        };
        if (existingUserIndex > -1) {
          users[existingUserIndex] = newUser; // Atualizar usuário existente
        } else {
          users.push(newUser);
        }
        localStorage.setItem('users', JSON.stringify(users));

        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        // Simular auto-login ou redirecionar para a página/modal de login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUserEmail', userEmail);
        updateLoginUI(); // Atualizar UI imediatamente
        window.location.href = 'index.html'; // Redirecionar para a página inicial ou perfil
      } else {
        alert('Por favor, preencha e-mail e senha.');
      }
    });
  }

  // Lógica do Modal de Autenticação
  const authModal = document.getElementById('auth-modal');
  const openAuthModalButtons = document.querySelectorAll(
    '.nube-btn-login, .nube-btn-register, .nube-btn-login_header, .nube-btn-register_header'
  );
  const closeAuthModalBtn = document.getElementById('close-auth-modal');
  const authForm = document.getElementById('register-form'); // Este é o formulário de login no modal

  if (authModal && closeAuthModalBtn && authForm) {
    openAuthModalButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        const isRegisterButton = event.target.classList.contains('nube-btn-register') || event.target.classList.contains('nube-btn-register_header');
        const modalTitle = authModal.querySelector('h2');
        const submitButton = authForm.querySelector('button[type="submit"]');

        if (isRegisterButton) {
          // Se for um botão de registro, redirecionar para cadastro.html
          window.location.href = 'cadastro.html';
          return; // Parar execução adicional para abertura do modal
        }

        // Caso contrário, é um botão de login, então abra o modal para login
        modalTitle.textContent = 'Login';
        submitButton.textContent = 'Entrar';
        authForm.onsubmit = handleLoginSubmit; // Atribuir manipulador de login
        authModal.classList.remove('hidden');

        if (mobileNav && mobileNav.classList.contains('is-open') && typeof closeMenu === 'function') {
          closeMenu();
        }
        const firstFocusableElementInModal = authModal.querySelector('input, button');
        if (firstFocusableElementInModal) {
          firstFocusableElementInModal.focus();
        }
      });
    });

    closeAuthModalBtn.addEventListener('click', () => {
      authModal.classList.add('hidden');
    });

    function handleLoginSubmit(e) {
      e.preventDefault();
      const email = authForm.email.value.trim();
      const password = authForm.senha.value; // Senha em texto simples (RUIM para produção)

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const foundUser = users.find(user => user.email === email && user.password === password); // Verificação direta de senha (RUIM)

      if (foundUser) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUserEmail', foundUser.email);
        authModal.classList.add('hidden');
        updateLoginUI(); // Atualizar cabeçalho/navegação
        alert('Login bem-sucedido!');
        window.location.href = 'profile.html'; // Ou painel
      } else {
        alert('E-mail ou senha inválidos.');
      }
    }
  }

  // Chamar atualização da UI no carregamento
  updateLoginUI();
});


document.addEventListener('DOMContentLoaded', () => {
    // ... (todo o seu código existente do script.js) ...

    // --- LÓGICA PARA PUBLICAR VAGA ---
    const publishVacancyForm = document.getElementById('publishVacancyForm');

    if (publishVacancyForm) {
        publishVacancyForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Impede o recarregamento da página

            // Pega as vagas já existentes no localStorage ou cria um array novo
            const existingVacancies = JSON.parse(localStorage.getItem('vacancies')) || [];

            // Cria um objeto para a nova vaga com os dados do formulário
            const newVacancy = {
                id: Date.now(), // Cria um ID único baseado no tempo
                title: this.vacancyTitle.value,
                company: this.companyName.value,
                location: this.vacancyLocation.value,
                salary: this.vacancySalary.value,
                workload: this.vacancyWorkload.value,
                benefits: this.vacancyBenefits.value.split(','), // Separa os benefícios por vírgula
                description: this.vacancyDescription.value,
                datePosted: new Date().toLocaleDateString('pt-BR') // Adiciona a data de publicação
            };

            // Adiciona a nova vaga ao array de vagas
            existingVacancies.push(newVacancy);

            // Salva o array atualizado de volta no localStorage
            localStorage.setItem('vacancies', JSON.stringify(existingVacancies));

            // Informa o usuário e limpa o formulário
            alert('Vaga publicada com sucesso!');
            this.reset();

            // Redireciona o usuário para a página de busca para ver a nova vaga
            window.location.href = 'search.html';
        });
    }
});