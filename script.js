// Executa tudo após o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initModalAuth();
  initHeroSearch();
  initSearchPageLogic();
  initPublicarVaga();
  // O sistema de autenticação é inicializado automaticamente pelo auth.js
});

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
  const openBtns = document.querySelectorAll(
    ".nube-btn-login, .nube-btn-login_header, .nube-btn-register, .nube-btn-register_header"
  );

  if (!modal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (
        btn.classList.contains("nube-btn-register") ||
        btn.classList.contains("nube-btn-register_header")
      ) {
        window.location.href = "cadastro.html";
        return;
      }

      modal.querySelector("h2").textContent = "Login";
      modal.querySelector('button[type="submit"]').textContent = "Entrar";
      modal.classList.remove("hidden");

      const input = modal.querySelector("input, button");
      if (input) input.focus();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  }
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
function initSearchPageLogic() {
  if (!location.pathname.includes("search.html")) return;

  const form = document.querySelector(".nube-search-bar");
  const grid = document.querySelector(".nube-card-grid");
  if (!form || !grid) return;

  let cards = Array.from(grid.querySelectorAll(".nube-vaga-card"));
  const stored = JSON.parse(localStorage.getItem("vacancies")) || [];

  stored.forEach((v) => {
    const html = `
      <div class="nube-vaga-card">
        <h3 class="nube-vaga-title">${v.title}</h3>
        <p class="nube-vaga-empresa">${v.company}</p>
        <p class="nube-vaga-location">${v.location}</p>
        <ul class="nube-vaga-details-list">
          ${v.salary ? `<li>Bolsa: ${v.salary}</li>` : ""}
          ${v.workload ? `<li>Carga horária: ${v.workload}</li>` : ""}
          ${v.benefits?.length ? `<li>Benefícios: ${v.benefits.join(", ")}</li>` : ""}
        </ul>
        <div class="nube-vaga-footer-meta">
          <button class="nube-btn-details">Ver Detalhes</button>
          <span class="nube-vaga-date-posted">${v.datePosted || "Data não informada"
      }</span>
        </div>
      </div>`;
    grid.insertAdjacentHTML("beforeend", html);
  });

  cards = Array.from(grid.querySelectorAll(".nube-vaga-card"));

  const [cargo, local] = form.querySelectorAll("input");
  const btn = form.querySelector(".nube-search-button");

  function filtrar() {
    const termoCargo = cargo.value.toLowerCase();
    const termoLocal = local.value.toLowerCase();

    cards.forEach((card) => {
      const match = card.textContent.toLowerCase();
      const okCargo = !termoCargo || match.includes(termoCargo);
      const okLocal = !termoLocal || match.includes(termoLocal);
      card.style.display = okCargo && okLocal ? "" : "none";
    });
  }

  btn?.addEventListener("click", filtrar);
  cargo?.addEventListener("input", filtrar);
  local?.addEventListener("input", filtrar);

  // ADICIONE ESTAS DUAS LINHAS ABAIXO PARA CORRIGIR O BUG
  cargo?.addEventListener("blur", filtrar);
  local?.addEventListener("blur", filtrar);

  const params = new URLSearchParams(location.search);
  if (params.get("cargo")) cargo.value = params.get("cargo");
  if (params.get("localidade")) local.value = params.get("localidade");
  if (params.get("cargo") || params.get("localidade")) filtrar();
}

/* ------------------------------
   📢 FORMULÁRIO DE PUBLICAR VAGA
------------------------------- */
function initPublicarVaga() {
  const form = document.getElementById("publishVacancyForm");
  const messageEl = document.getElementById("publishMessage"); // Pega o elemento da mensagem
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
      benefits: form.vacancyBenefits.value.split(",").map(b => b.trim()), // Limpa espaços em branco
      description: form.vacancyDescription.value,
      datePosted: new Date().toLocaleDateString("pt-BR"),
    };

    const vagas = JSON.parse(localStorage.getItem("vacancies")) || [];
    vagas.push(nova);
    localStorage.setItem("vacancies", JSON.stringify(vagas));

    // Mostra uma mensagem de sucesso no HTML
    if (messageEl) {
      messageEl.textContent = "Vaga publicada com sucesso! Redirecionando...";
      messageEl.style.color = "green";
      messageEl.style.fontWeight = "bold";
    }

    form.reset();

    // Redireciona após um breve intervalo para o usuário ler a mensagem
    setTimeout(() => {
      window.location.href = "search.html";
    }, 2000); // 2 segundos
  });
}