const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('nube-mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');

// Função para fechar o menu mobile - declarada aqui para ser acessível globalmente no script
let closeMenu = () => {
  // Implementação será definida abaixo se os elementos do menu existirem
};

if (mobileMenuToggle && mobileNav && mobileNavOverlay && mobileMenuClose) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileNav.classList.add('is-open');
    mobileNavOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    mobileNav.setAttribute('aria-hidden', 'false');
    if (mobileMenuClose) { // Adiciona verificação
      mobileMenuClose.focus();
    }
  });

  // Define a função closeMenu com a lógica correta
  closeMenu = () => {
    if (mobileNav && mobileNavOverlay && mobileMenuToggle) { // Adiciona verificação
      mobileNav.classList.remove('is-open');
      mobileNavOverlay.style.display = 'none';
      document.body.style.overflow = '';
      mobileNav.setAttribute('aria-hidden', 'true');
      // Devolve o foco ao botão que abriu o menu,
      // apenas se o foco estava dentro do menu ou no botão de fechar.
      if (document.activeElement === mobileMenuClose || (mobileNav && mobileNav.contains(document.activeElement))) {
        mobileMenuToggle.focus();
      }
    }
  };

  mobileMenuClose.addEventListener('click', closeMenu);
  mobileNavOverlay.addEventListener('click', closeMenu);
}

// Lógica do Modal
const modal = document.getElementById('auth-modal');
// ATUALIZAR ESTE SELETOR para incluir todas as variações de botões de login/cadastro
const openAuthModalButtons = document.querySelectorAll(
  '.nube-btn-login, .nube-btn-register, .nube-btn-login_header, .nube-btn-register_header'
);
const closeAuthModalBtn = document.getElementById('close-auth-modal');
const authForm = document.getElementById('register-form');

if (modal && closeAuthModalBtn && authForm) {
  openAuthModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');

      // Se o menu mobile estiver aberto, feche-o
      if (mobileNav && mobileNav.classList.contains('is-open') && typeof closeMenu === 'function') {
        closeMenu();
      }

      // Opcional: mover foco para dentro do modal
      const firstFocusableElementInModal = modal.querySelector('input, button');
      if (firstFocusableElementInModal) {
        firstFocusableElementInModal.focus();
      }
    });
  });

  closeAuthModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    // Opcional: Devolver o foco para o botão que originalmente abriu o modal
    // Isso requer rastrear qual botão abriu o modal.
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = authForm.email.value.trim();
    const senha = authForm.senha.value;
    if (email && senha) {
      window.location.href = 'cadastro.html';
    } else {
      alert('Preencha os campos corretamente.');
    }
  });
}

// Lógica do btnFinalizar (se ainda for usada globalmente)
const btnFinalizar = document.getElementById('btnFinalizar');
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}