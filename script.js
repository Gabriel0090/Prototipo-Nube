// Seleciona elementos do DOM
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileNav = document.getElementById('nube-mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');

const modal = document.getElementById('auth-modal');
const openButtons = document.querySelectorAll('.nube-btn-login_header, .nube-btn-register_header');
const closeBtn = document.getElementById('close-auth-modal');
const form = document.getElementById('register-form');

openButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modal.classList.remove('hidden');
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
