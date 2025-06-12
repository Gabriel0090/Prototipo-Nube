// Executa tudo após o carregamento completo do DOM
// script.js
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initModalAuth();
  initHeroSearch();
  initSearchPageLogic();
  initVacancyDetailsModal();
  initCandidacyPageLogic(); // <--- ADICIONE ESTA LINHA
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
// ============================================================================
// COPIE E COLE TODO ESTE BLOCO NO LUGAR DA SUA FUNÇÃO initSearchPageLogic
// ============================================================================

/* ---------------------------------------
   🔎 LÓGICA DE FILTRO NA PÁGINA DE BUSCA (VERSÃO DEFINITIVA)
---------------------------------------- */

/**
 * Função para limpar e padronizar texto para a busca.
 * Ela remove acentos, espaços desnecessários e converte para minúsculas.
 */
function removerAcentos(texto) {
  if (!texto) return "";
  return texto
    .trim() // 1. Remove espaços do início e do fim
    .normalize("NFD") // 2. Separa letras dos acentos
    .replace(/[\u0300-\u036f]/g, "") // 3. Remove os acentos
    .toLowerCase(); // 4. Converte para minúsculas
}

/* ---------------------------------------
   🔎 LÓGICA DE FILTRO E PAGINAÇÃO NA PÁGINA DE BUSCA
---------------------------------------- */
function initSearchPageLogic() {
  if (!location.pathname.includes("search.html")) return;

  const VAGAS_POR_PAGINA = 9;
  let vagasVisiveis = VAGAS_POR_PAGINA;
  let todasAsVagas = [];
  let vagasFiltradas = [];

  const form = document.querySelector(".nube-search-bar");
  const grid = document.querySelector(".nube-card-grid");
  const btnCarregarMais = document.querySelector('.nube-centered-button-wrapper .nube-btn-primary');

  if (!form || !grid || !btnCarregarMais) return;

  // 1. Coleta todas as vagas, tanto as estáticas quanto as dinâmicas
  const vagasEstaticas = Array.from(grid.querySelectorAll(".nube-vaga-card"));
  const vagasSalvas = JSON.parse(localStorage.getItem("vacancies")) || [];

  vagasSalvas.forEach((v) => {
    // Adiciona os data-attributes para o modal de detalhes funcionar
    const description = v.description || 'Nenhuma descrição fornecida.';
    const salary = v.salary || 'Não informado';
    const workload = v.workload || 'Não informado';
    const benefits = v.benefits?.join(', ') || 'Não informado';
    const cardHtml = `
      <div class="nube-vaga-card" 
        data-title="${v.title}" 
        data-company="${v.company}" 
        data-location="${v.location}"
        data-description="${description}"
        data-salary="${salary}"
        data-workload="${workload}"
        data-benefits="${benefits}">
        <h3 class="nube-vaga-title">${v.title}</h3>
        <p class="nube-vaga-empresa">${v.company}</p>
        <p class="nube-vaga-location">${v.location}</p>
        <ul class="nube-vaga-details-list">
            ${v.salary ? `<li>Bolsa: ${v.salary}</li>` : ""}
            ${v.workload ? `<li>Carga horária: ${v.workload}</li>` : ""}
        </ul>
        <div class="nube-vaga-footer-meta">
            <button class="nube-btn-details">Ver Detalhes</button>
            <span class="nube-vaga-date-posted">${v.datePosted || "Data não informada"}</span>
        </div>
      </div>`;
    grid.insertAdjacentHTML("beforeend", cardHtml);
  });

  todasAsVagas = Array.from(grid.querySelectorAll(".nube-vaga-card"));
  vagasFiltradas = [...todasAsVagas]; // Inicialmente, todas as vagas estão "filtradas"

  const [cargo, local] = form.querySelectorAll("input");
  const btnBuscar = form.querySelector(".nube-search-button");

  // Função que controla a exibição das vagas e do botão "Carregar Mais"
  function exibirVagas() {
    todasAsVagas.forEach(card => card.style.display = 'none'); // Esconde todas primeiro

    const vagasParaExibir = vagasFiltradas.slice(0, vagasVisiveis);
    vagasParaExibir.forEach(card => card.style.display = '');

    // Esconde o botão se não houver mais vagas para mostrar
    if (vagasVisiveis >= vagasFiltradas.length) {
      btnCarregarMais.style.display = 'none';
    } else {
      btnCarregarMais.style.display = '';
    }
  }

  // Função que filtra as vagas com base nos inputs
  function filtrarVagas() {
    const termoCargo = removerAcentos(cargo.value);
    const termoLocal = removerAcentos(local.value);

    vagasFiltradas = todasAsVagas.filter(card => {
      const conteudoCard = removerAcentos(card.textContent);
      const encontrouCargo = !termoCargo || conteudoCard.includes(termoCargo);
      const encontrouLocal = !termoLocal || conteudoCard.includes(termoLocal);
      return encontrouCargo && encontrouLocal;
    });

    // Reseta a contagem e exibe a primeira página de resultados
    vagasVisiveis = VAGAS_POR_PAGINA;
    exibirVagas();
  }

  // Configuração dos Eventos
  btnBuscar?.addEventListener("click", filtrarVagas);
  cargo?.addEventListener("input", filtrarVagas);
  local?.addEventListener("input", filtrarVagas);

  btnCarregarMais.addEventListener('click', () => {
    vagasVisiveis += VAGAS_POR_PAGINA;
    exibirVagas();
  });

  // Preenche a busca se vier da página inicial e executa a exibição inicial
  const params = new URLSearchParams(location.search);
  if (params.get("cargo")) cargo.value = params.get("cargo");
  if (params.get("localidade")) local.value = params.get("localidade");

  if (params.get("cargo") || params.get("localidade")) {
    filtrarVagas();
  } else {
    exibirVagas(); // Exibição inicial das 9 primeiras vagas
  }
}

// Função auxiliar que você já deve ter no seu script.js
function removerAcentos(texto) {
  if (!texto) return "";
  return texto
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
cards = Array.from(grid.querySelectorAll(".nube-vaga-card"));

const [cargo, local] = form.querySelectorAll("input");
const btn = form.querySelector(".nube-search-button");

// Função principal que faz a mágica de filtrar
function filtrar() {
  // Usa a função para limpar o que o usuário digitou
  const termoCargo = removerAcentos(cargo.value);
  const termoLocal = removerAcentos(local.value);

  // Passa por cada vaga para ver se deve ser mostrada ou não
  cards.forEach((card) => {
    // Limpa também o texto da vaga para a comparação ser justa
    const conteudoCard = removerAcentos(card.textContent);

    const encontrouCargo = !termoCargo || conteudoCard.includes(termoCargo);
    const encontrouLocal = !termoLocal || conteudoCard.includes(termoLocal);

    // Mostra o card apenas se corresponder à busca
    card.style.display = encontrouCargo && encontrouLocal ? "" : "none";
  });
}

// Gatilhos que chamam a função filtrar
btn?.addEventListener("click", filtrar);
cargo?.addEventListener("input", filtrar);
local?.addEventListener("input", filtrar);
cargo?.addEventListener("blur", filtrar);
local?.addEventListener("blur", filtrar);

// Preenche a busca se vier da página inicial
const params = new URLSearchParams(location.search);
if (params.get("cargo")) cargo.value = params.get("cargo");
if (params.get("localidade")) local.value = params.get("localidade");
if (params.get("cargo") || params.get("localidade")) filtrar();


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
/* ---------------------------------------
   💎 MODAL DE DETALHES DA VAGA
---------------------------------------- */
function initVacancyDetailsModal() {
  const modal = document.getElementById("vacancy-details-modal");
  if (!modal) return;

  const closeBtn = document.getElementById("close-vacancy-modal");
  const grid = document.querySelector(".nube-card-grid");

  // Elementos do Modal
  const vagaTitle = document.getElementById("modal-vaga-title");
  const vagaCompany = document.getElementById("modal-vaga-company");
  const vagaLocation = document.getElementById("modal-vaga-location");
  const vagaDescription = document.getElementById("modal-vaga-description");
  const vagaSalary = document.getElementById("modal-vaga-salary");
  const vagaWorkload = document.getElementById("modal-vaga-workload");
  const vagaBenefits = document.getElementById("modal-vaga-benefits");

  const openModal = (card) => {
    // Pega os dados do data-attribute do card
    const data = card.dataset;

    // Preenche o modal com os dados
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

  // Usando delegação de eventos para escutar cliques nos botões
  grid?.addEventListener("click", (e) => {
    if (e.target.classList.contains("nube-btn-details")) {
      const card = e.target.closest(".nube-vaga-card, .nube-candidatura-card");
      if (card) {
        openModal(card);
      }
    }
  });

  closeBtn.addEventListener("click", closeModal);

  // Fecha o modal se clicar fora dele (no overlay)
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
  // Garante que o código só rode na página de candidaturas
  if (!location.pathname.includes("candidacy.html")) return;

  const CANDIDATURAS_POR_PAGINA = 3;
  let candidaturasVisiveis = CANDIDATURAS_POR_PAGINA;

  const grid = document.querySelector(".nube-card-grid");
  const btnCarregarMais = document.querySelector('.nube-centered-button-wrapper .nube-btn-primary');

  if (!grid || !btnCarregarMais) return;

  const todasAsCandidaturas = Array.from(grid.querySelectorAll(".nube-candidatura-card"));

  function exibirCandidaturas() {
    // Esconde todos os cards de candidatura primeiro
    todasAsCandidaturas.forEach((card, index) => {
      if (index < candidaturasVisiveis) {
        card.style.display = ''; // Mostra o card se ele estiver dentro do limite
      } else {
        card.style.display = 'none'; // Esconde o card se ele estiver além do limite
      }
    });

    // Esconde o botão "Ver Todas" se não houver mais candidaturas para mostrar
    if (candidaturasVisiveis >= todasAsCandidaturas.length) {
      btnCarregarMais.style.display = 'none';
    } else {
      btnCarregarMais.style.display = '';
    }
  }

  // Adiciona o evento de clique ao botão
  btnCarregarMais.addEventListener('click', () => {
    // Aumenta o número de vagas visíveis
    candidaturasVisiveis += CANDIDATURAS_POR_PAGINA;
    // Atualiza a exibição
    exibirCandidaturas();
  });

  // Executa a função uma vez para mostrar as 3 primeiras candidaturas
  exibirCandidaturas();
}