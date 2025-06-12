// Executa tudo após o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initModalAuth();
  initSocialLoginAlerts();
  initHeroSearch();
  initSearchPageLogic();
  initVacancyDetailsModal();
  initCandidacyPageLogic();
  initPublicarVaga();
  initCadastroPage(); // <-- NOVA FUNÇÃO CHAMADA AQUI
  // O sistema de autenticação é inicializado automaticamente pelo auth.js
});

/* -------------------------------------------
   👁️ LÓGICA DA PÁGINA DE CADASTRO (NOVA FUNÇÃO)
-------------------------------------------- */
function initCadastroPage() {
  // Garante que este código só execute na página de cadastro
  if (!document.getElementById('cadastroForm')) {
    return;
  }

  // Ativa o toggle para os dois campos de senha usando seus novos IDs
  setupPasswordToggle('senha', 'senha-toggle');
  setupPasswordToggle('confirmar_senha', 'confirmar_senha-toggle');
}

/* ------------------------
   ☰ MENU MOBILE RESPONSIVO
------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const nav = document.getElementById("nube-mobile-nav");
  const overlay = document.getElementById("mobile-nav-overlay");
  const close = document.getElementById("mobile-menu-close");

  if (toggle && nav && overlay && close) {
    toggle.addEventListener("click", () => {
      nav.classList.add("is-open");
      overlay.style.display = "block";
      document.body.style.overflow = "hidden";
      nav.setAttribute("aria-hidden", "false");
      close.focus();
    });

    const closeMenu = () => {
      nav.classList.remove("is-open");
      overlay.style.display = "none";
      document.body.style.overflow = "";
      nav.setAttribute("aria-hidden", "true");
      toggle.focus();
    };

    close.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
  }
}

/* -------------------------------
   🔐 MODAL DE LOGIN E REGISTRO
------------------------------- */
function initModalAuth() {
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("close-auth-modal");
  const loginBtns = document.querySelectorAll(".nube-btn-login, .nube-btn-login_header");
  const registerBtns = document.querySelectorAll(".nube-btn-register, .nube-btn-register_header");

  if (modal) {
    loginBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const modalTitle = modal.querySelector("h2");
        const modalSubmitBtn = modal.querySelector('button[type="submit"]');
        if (modalTitle) modalTitle.textContent = "Login";
        if (modalSubmitBtn) modalSubmitBtn.textContent = "Entrar";
        modal.classList.remove("hidden");
        setupPasswordToggle('senha', 'login-password-toggle');
        const input = modal.querySelector("input, button");
        if (input) input.focus();
      });
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }
  }

  registerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "cadastro.html";
    });
  });
}

/* ---------------------------------------
   📢 ALERTA PARA LOGIN SOCIAL
---------------------------------------- */
function initSocialLoginAlerts() {
  const socialButtons = document.querySelectorAll('.social-login-btn');
  socialButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Esta opção está em fase de testes e ainda não está habilitada. Por favor, utilize o cadastro por email e senha.');
    });
  });
}


/* ------------------------------
   🔍 BARRA DE PESQUISA HERO
------------------------------- */
function initHeroSearch() {
  const bar = document.querySelector(".nube-hero-section .nube-search-bar");
  if (!bar) return;

  const [cargo, local] = bar.querySelectorAll("input");
  const btn = bar.querySelector(".nube-search-button");

  btn?.addEventListener("click", () => {
    const query = `search.html?cargo=${encodeURIComponent(
      cargo.value
    )}&localidade=${encodeURIComponent(local.value)}`;
    window.location.href = query;
  });
}

/* ---------------------------------------
   🔎 LÓGICA DE FILTRO NA PÁGINA DE BUSCA
---------------------------------------- */
function removerAcentos(texto) {
  if (!texto) return "";
  return texto
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function initSearchPageLogic() {
  if (!location.pathname.includes("search.html")) return;

  const VAGAS_POR_PAGINA = 9;
  let vagasVisiveis = VAGAS_POR_PAGINA;
  let todasAsVagas = [];
  let vagasFiltradas = [];

  const form = document.querySelector(".nube-search-bar");
  const grid = document.querySelector(".nube-card-grid");
  const btnCarregarMais = document.querySelector('.nube-centered-button-wrapper .nube-btn-primary');
  const loadingSpinner = document.getElementById('loading-spinner');

  if (!form || !grid || !btnCarregarMais || !loadingSpinner) return;

  todasAsVagas = Array.from(grid.querySelectorAll(".nube-vaga-card"));
  vagasFiltradas = [...todasAsVagas];

  const [cargoInput, localInput] = form.querySelectorAll("input");
  const salarioSelect = document.getElementById('faixa-salarial');
  const cargaHorariaSelect = document.getElementById('carga-horaria');

  const parseSalary = (salaryText) => {
    if (!salaryText) return 0;
    return parseFloat(salaryText.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
  };

  const parseWorkload = (workloadText) => {
    if (!workloadText) return 0;
    return parseInt(workloadText.replace(/[^0-9]/g, '')) || 0;
  };

  function exibirVagas() {
    todasAsVagas.forEach(card => card.style.display = 'none');
    const vagasParaExibir = vagasFiltradas.slice(0, vagasVisiveis);
    vagasParaExibir.forEach(card => card.style.display = '');
    btnCarregarMais.style.display = vagasVisiveis >= vagasFiltradas.length ? 'none' : '';
  }

  function filtrarVagas() {
    loadingSpinner.classList.remove('hidden');
    grid.style.display = 'none';
    btnCarregarMais.style.display = 'none';

    setTimeout(() => {
      const termoCargo = removerAcentos(cargoInput.value);
      const termoLocal = removerAcentos(localInput.value);
      const filtroSalario = salarioSelect.value;
      const filtroCarga = cargaHorariaSelect.value;

      vagasFiltradas = todasAsVagas.filter(card => {
        const conteudoCard = removerAcentos(card.textContent);
        const salarioCard = parseSalary(card.dataset.salary);
        const cargaCard = parseWorkload(card.dataset.workload);

        const encontrouCargo = !termoCargo || conteudoCard.includes(termoCargo);
        const encontrouLocal = !termoLocal || conteudoCard.includes(termoLocal);

        let encontrouSalario = true;
        if (filtroSalario) {
          switch (filtroSalario) {
            case 'ate-1000': encontrouSalario = salarioCard > 0 && salarioCard <= 1000; break;
            case '1001-1500': encontrouSalario = salarioCard > 1000 && salarioCard <= 1500; break;
            case '1501-2000': encontrouSalario = salarioCard > 1500 && salarioCard <= 2000; break;
            case 'acima-2000': encontrouSalario = salarioCard > 2000; break;
          }
        }

        let encontrouCarga = true;
        if (filtroCarga) {
          switch (filtroCarga) {
            case 'ate-20': encontrouCarga = cargaCard > 0 && cargaCard <= 20; break;
            case '21-30': encontrouCarga = cargaCard > 20 && cargaCard <= 30; break;
            case 'acima-30': encontrouCarga = cargaCard > 30; break;
          }
        }

        return encontrouCargo && encontrouLocal && encontrouSalario && encontrouCarga;
      });

      vagasVisiveis = VAGAS_POR_PAGINA;
      loadingSpinner.classList.add('hidden');
      grid.style.display = '';
      exibirVagas();
    }, 500);
  }

  form.addEventListener('submit', (e) => e.preventDefault());
  cargoInput.addEventListener("input", filtrarVagas);
  localInput.addEventListener("input", filtrarVagas);
  salarioSelect.addEventListener("change", filtrarVagas);
  cargaHorariaSelect.addEventListener("change", filtrarVagas);

  btnCarregarMais.addEventListener('click', () => {
    vagasVisiveis += VAGAS_POR_PAGINA;
    exibirVagas();
  });

  exibirVagas();
}

/* ------------------------------
📢 FORMULÁRIO DE PUBLICAR VAGA
------------------------------- */
function initPublicarVaga() {
  const form = document.getElementById("publishVacancyForm");
  const messageEl = document.getElementById("publishMessage");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nova = {
      id: Date.now(),
      title: form.vacancyTitle.value,
      company: form.companyName.value,
      location: form.vacancyLocation.value,
      salary: form.vacancySalary.value,
      workload: form.vacancyWorkload.value,
      benefits: form.vacancyBenefits.value.split(",").map(b => b.trim()),
      description: form.vacancyDescription.value,
      datePosted: new Date().toLocaleDateString("pt-BR"),
    };
    const vagas = JSON.parse(localStorage.getItem("vacancies")) || [];
    vagas.push(nova);
    localStorage.setItem("vacancies", JSON.stringify(vagas));
    if (messageEl) {
      messageEl.textContent = "Vaga publicada com sucesso! Redirecionando...";
      messageEl.style.color = "green";
      messageEl.style.fontWeight = "bold";
    }
    form.reset();
    setTimeout(() => {
      window.location.href = "search.html";
    }, 2000);
  });
}

/* ---------------------------------------
   💎 MODAL DE DETALHES DA VAGA
---------------------------------------- */
function initVacancyDetailsModal() {
  const modal = document.getElementById("vacancy-details-modal");
  if (!modal) return;
  const closeBtn = document.getElementById("close-vacancy-modal");
  const grid = document.querySelector(".nube-card-grid");
  const vagaTitle = document.getElementById("modal-vaga-title");
  const vagaCompany = document.getElementById("modal-vaga-company");
  const vagaLocation = document.getElementById("modal-vaga-location");
  const vagaDescription = document.getElementById("modal-vaga-description");
  const vagaSalary = document.getElementById("modal-vaga-salary");
  const vagaWorkload = document.getElementById("modal-vaga-workload");
  const vagaBenefits = document.getElementById("modal-vaga-benefits");

  const openModal = (card) => {
    const data = card.dataset;
    vagaTitle.textContent = data.title;
    vagaCompany.textContent = data.company;
    vagaLocation.textContent = data.location;
    vagaDescription.textContent = data.description;
    vagaSalary.textContent = data.salary;
    vagaWorkload.textContent = data.workload;
    vagaBenefits.textContent = data.benefits;
    modal.classList.remove("hidden");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
  };

  grid?.addEventListener("click", (e) => {
    if (e.target.classList.contains("nube-btn-details")) {
      const card = e.target.closest(".nube-vaga-card, .nube-candidatura-card");
      if (card) {
        openModal(card);
      }
    }
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/* ---------------------------------------
   📄 LÓGICA DE PAGINAÇÃO EM MINHAS CANDIDATURAS
---------------------------------------- */
function initCandidacyPageLogic() {
  if (!location.pathname.includes("candidacy.html")) return;
  const CANDIDATURAS_POR_PAGINA = 3;
  let candidaturasVisiveis = CANDIDATURAS_POR_PAGINA;
  const grid = document.querySelector(".nube-card-grid");
  const btnCarregarMais = document.querySelector('.nube-centered-button-wrapper .nube-btn-primary');
  if (!grid || !btnCarregarMais) return;
  const todasAsCandidaturas = Array.from(grid.querySelectorAll(".nube-candidatura-card"));

  function exibirCandidaturas() {
    todasAsCandidaturas.forEach((card, index) => {
      card.style.display = index < candidaturasVisiveis ? '' : 'none';
    });
    btnCarregarMais.style.display = candidaturasVisiveis >= todasAsCandidaturas.length ? 'none' : '';
  }

  btnCarregarMais.addEventListener('click', () => {
    candidaturasVisiveis += CANDIDATURAS_POR_PAGINA;
    exibirCandidaturas();
  });
  exibirCandidaturas();
}

/* ---------------------------------------
   👁️ FUNÇÃO PARA MOSTRAR/ESCONDER SENHA
---------------------------------------- */
function setupPasswordToggle(inputId, toggleId) {
  const passwordInput = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);

  if (!passwordInput || !toggle) return;

  const eyeIconPaths = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    `;
  const eyeOffIconPaths = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542 7 .847 0 1.67.127 2.454.364m-6.082 11.458A9.963 9.963 0 0112 15a3 3 0 100-6 3 3 0 00-1.025.208m-3.417 5.416a2.985 2.985 0 004.425 4.425L6.458 17.25zM12 9a3 3 0 013 3m-3 0a3 3 0 00-3 3m3-3l6.458 6.458m-6.458-6.458L5.542 3.542"></path>
    `;

  const newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);

  newToggle.addEventListener('click', () => {
    const svg = newToggle.querySelector('svg');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      svg.innerHTML = eyeOffIconPaths;
    } else {
      passwordInput.type = 'password';
      svg.innerHTML = eyeIconPaths;
    }
  });
}