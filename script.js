const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('nube-mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');

// Lógica do Modal (existente no seu script) - MANTENHA ESTA PARTE COMO ESTÁ
const modal = document.getElementById('auth-modal');
const openButtons = document.querySelectorAll('.nube-btn-login_header, .nube-btn-register_header');
const closeBtn = document.getElementById('close-auth-modal');
const form = document.getElementById('register-form');

if (modal && closeBtn && form) { // Verifica se os elementos do modal existem
  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) { // Checagem adicional dentro do loop
        modal.classList.remove('hidden');
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    if (email && senha) {
      window.location.href = 'cadastro.html';
    } else {
      alert('Preencha os campos corretamente.');
    }
  });
}
// Fim da lógica do Modal

// --- INÍCIO DA LÓGICA CORRIGIDA DO MENU MOBILE ---
if (mobileMenuToggle && mobileNav && mobileNavOverlay && mobileMenuClose) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileNav.classList.add('is-open'); // Usa a classe .is-open para mostrar o menu
    mobileNavOverlay.style.display = 'block'; // Mostra o overlay
    document.body.style.overflow = 'hidden'; // Impede o scroll da página ao fundo
  });

  const closeMenu = () => {
    mobileNav.classList.remove('is-open'); // Usa a classe .is-open para esconder o menu
    mobileNavOverlay.style.display = 'none'; // Esconde o overlay
    document.body.style.overflow = ''; // Restaura o scroll da página
  };

  mobileMenuClose.addEventListener('click', closeMenu);
  mobileNavOverlay.addEventListener('click', closeMenu); // Clicar no overlay também fecha
}
// --- FIM DA LÓGICA CORRIGIDA DO MENU MOBILE ---

// Lógica do btnFinalizar (existente no seu script) - MANTENHA SE NECESSÁRIO, MAS COM VERIFICAÇÃO
const btnFinalizar = document.getElementById('btnFinalizar');
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}