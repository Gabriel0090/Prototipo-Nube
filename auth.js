/**
 * auth.js - Sistema de autenticação usando localStorage
 * 
 * Este arquivo implementa as funcionalidades de:
 * - Cadastro de usuários
 * - Login/Logout
 * - Gerenciamento de estado de autenticação
 * - Atualização da interface baseada no estado de login
 */

// Estrutura de dados para usuários
class AuthSystem {
  constructor() {
    // Inicializa o sistema de autenticação
    this.init();
  }

  // Inicializa o sistema e configura os listeners
  init() {
    // Verifica se já existe um usuário logado
    this.checkLoginState();
    
    // Configura os listeners para os formulários de login e cadastro
    this.setupLoginForm();
    this.setupRegisterForm();
    
    // Atualiza a interface com base no estado de login
    this.updateUI();
  }

  // Verifica o estado de login atual
  checkLoginState() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.currentUserEmail = localStorage.getItem("loggedInUserEmail");
    
    // Obtém os dados completos do usuário logado
    if (this.isLoggedIn && this.currentUserEmail) {
      const users = this.getUsers();
      this.currentUser = users.find(user => user.email === this.currentUserEmail) || null;
    } else {
      this.currentUser = null;
    }
  }

  // Obtém a lista de usuários do localStorage
  getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  // Salva a lista de usuários no localStorage
  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Registra um novo usuário
  registerUser(userData) {
    const users = this.getUsers();
    
    // Verifica se o email já está em uso
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return { success: false, message: "Este email já está cadastrado." };
    }
    
    // Adiciona o novo usuário
    users.push(userData);
    this.saveUsers(users);
    
    // Faz login automático após o cadastro
    this.login(userData.email);
    
    return { success: true, message: "Cadastro realizado com sucesso!" };
  }

  // Realiza o login do usuário
  login(email, password = null) {
    const users = this.getUsers();
    
    // Se a senha for fornecida, valida as credenciais
    if (password !== null) {
      const user = users.find(user => user.email === email && user.password === password);
      if (!user) {
        return { success: false, message: "Email ou senha inválidos." };
      }
    }
    
    // Salva o estado de login no localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUserEmail", email);
    
    // Atualiza o estado interno
    this.isLoggedIn = true;
    this.currentUserEmail = email;
    this.currentUser = users.find(user => user.email === email);
    
    // Atualiza a interface
    this.updateUI();
    
    return { success: true, message: "Login realizado com sucesso!" };
  }

  // Realiza o logout do usuário
  logout() {
    // Remove o estado de login do localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUserEmail");
    
    // Atualiza o estado interno
    this.isLoggedIn = false;
    this.currentUserEmail = null;
    this.currentUser = null;
    
    // Atualiza a interface
    this.updateUI();
    
    return { success: true, message: "Logout realizado com sucesso!" };
  }

  // Configura o formulário de login
  setupLoginForm() {
    const loginForm = document.getElementById("register-form");
    if (!loginForm) return;
    
    // Remove listeners existentes para evitar duplicação
    const newLoginForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);
    
    // Adiciona o novo listener
    newLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = newLoginForm.email.value.trim();
      const password = newLoginForm.senha.value;
      
      const result = this.login(email, password);
      
      if (result.success) {
        // Fecha o modal
        const modal = document.getElementById("auth-modal");
        if (modal) modal.classList.add("hidden");
        
        // Redireciona para a página de perfil
        window.location.href = "profile.html";
      } else {
        alert(result.message);
      }
    });
  }

  // Configura o formulário de cadastro
  setupRegisterForm() {
    const registerForm = document.getElementById("cadastroForm");
    if (!registerForm) return;
    
    // Remove listeners existentes para evitar duplicação
    const newRegisterForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newRegisterForm, registerForm);
    
    // Adiciona o novo listener
    newRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Coleta os dados do formulário
      const userData = {
        email: newRegisterForm.querySelector("[name=\"email\"]")?.value.trim() || "",
        password: newRegisterForm.querySelector("[name=\"senha\"]")?.value || "",
        name: newRegisterForm.querySelector("[name=\"nome\"]")?.value || "",
        // Dados adicionais opcionais
        birthDate: newRegisterForm.querySelector("[name=\"data_nascimento\"]")?.value || "",
        gender: newRegisterForm.querySelector("[name=\"genero\"]")?.value || "",
        cpf: newRegisterForm.querySelector("[name=\"cpf\"]")?.value || "",
        phone: newRegisterForm.querySelector("[name=\"telefone\"]")?.value || "",
        address: {
          zipCode: newRegisterForm.querySelector("[name=\"cep\"]")?.value || "",
          street: newRegisterForm.querySelector("[name=\"endereco\"]")?.value || "",
          number: newRegisterForm.querySelector("[name=\"numero\"]")?.value || "",
          complement: newRegisterForm.querySelector("[name=\"complemento\"]")?.value || "",
          city: newRegisterForm.querySelector("[name=\"cidade\"]")?.value || "",
          state: newRegisterForm.querySelector("[name=\"estado\"]")?.value || ""
        },
        education: {
          level: newRegisterForm.querySelector("[name=\"escolaridade\"]")?.value || "",
          institution: newRegisterForm.querySelector("[name=\"instituicao\"]")?.value || "",
          course: newRegisterForm.querySelector("[name=\"curso\"]")?.value || "",
          period: newRegisterForm.querySelector("[name=\"periodo\"]")?.value || "",
          shift: newRegisterForm.querySelector("[name=\"turno\"]")?.value || ""
        }
      };
      
      // Verifica se os campos obrigatórios estão preenchidos
      if (!userData.email || !userData.password || !userData.name) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      
      const result = this.registerUser(userData);
      
      if (result.success) {
        alert(result.message);
        window.location.href = "index.html";
      } else {
        // Se o email já estiver cadastrado, pergunta se deseja fazer login
        if (result.message === "Este email já está cadastrado.") {
          if (confirm("Este email já está cadastrado. Deseja fazer login?")) {
            this.openLoginModalWithEmail(userData.email);
          }
        } else {
          alert(result.message);
        }
      }
    });
  }

  // Abre o modal de login e preenche o email
  openLoginModalWithEmail(email) {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;

    // Altera o título do modal para Login
    modal.querySelector("h2").textContent = "Login";
    modal.querySelector("button[type=\"submit\"]").textContent = "Entrar";

    // Preenche o campo de email
    const emailInput = modal.querySelector("#email");
    if (emailInput) {
      emailInput.value = email;
    }

    // Exibe o modal
    modal.classList.remove("hidden");
  }

  // Atualiza a interface com base no estado de login
  updateUI() {
    // Verifica o estado de login atual
    this.checkLoginState();
    
    // Elementos da interface
    const loginBtns = document.querySelectorAll(".nube-btn-login, .nube-btn-login_header");
    const registerBtns = document.querySelectorAll(".nube-btn-register, .nube-btn-register_header");
    const profileLinks = document.querySelectorAll("a[href=\"profile.html\"]");
    
    // Atualiza a visibilidade dos botões de login/cadastro
    loginBtns.forEach(btn => btn.style.display = this.isLoggedIn ? "none" : "");
    registerBtns.forEach(btn => btn.style.display = this.isLoggedIn ? "none" : "");
    profileLinks.forEach(link => link.style.display = this.isLoggedIn ? "" : "none");
    
    // Adiciona o botão de logout no menu principal
    this.updateLogoutButton(".nube-main-nav", "nube-btn-logout-header");
    
    // Adiciona o botão de logout no menu mobile
    this.updateLogoutButton(".nube-mobile-auth-buttons", "nube-btn-logout-mobile", true);
    
    // Atualiza a página de perfil se estiver nela
    this.updateProfilePage();
  }

  // Atualiza o botão de logout
  updateLogoutButton(parentSelector, className, isMobile = false) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    
    // Remove o botão existente para evitar duplicação
    const existing = parent.querySelector(`.${className}`);
    if (existing) existing.remove();
    
    // Adiciona o botão de logout se o usuário estiver logado
    if (this.isLoggedIn && this.currentUserEmail) {
      const btn = document.createElement("button");
      btn.className = className;
      btn.textContent = `Sair (${this.currentUserEmail.split("@")[0] || ""})`;
      
      // Estiliza o botão
      Object.assign(btn.style, {
        padding: "0.5rem 1.25rem",
        borderRadius: "9999px",
        border: "1px solid #9ca3af",
        color: "#374151",
        fontWeight: "500",
        marginLeft: isMobile ? "0" : "1rem",
        width: isMobile ? "100%" : "",
        marginTop: isMobile ? "0.5rem" : "",
        textAlign: isMobile ? "center" : ""
      });
      
      // Adiciona o evento de logout
      btn.addEventListener("click", () => {
        this.logout();
        window.location.href = "index.html";
      });
      
      // Adiciona o botão ao DOM
      parent.appendChild(btn);
    }
  }

  // Atualiza a página de perfil
  updateProfilePage() {
    // Verifica se estamos na página de perfil
    if (!window.location.pathname.includes("profile.html")) return;
    
    // Verifica se o usuário está logado
    if (!this.isLoggedIn || !this.currentUser) {
      // Redireciona para a página inicial se não estiver logado
      window.location.href = "index.html";
      return;
    }
    
    // Elementos da página de perfil
    const profileNameElement = document.getElementById("profile-name");
    const profileEmailElement = document.getElementById("profile-email");
    const profileDetailsElement = document.getElementById("profile-details");
    
    // Atualiza o nome e email do usuário
    if (profileNameElement) profileNameElement.textContent = this.currentUser.name || "Nome não informado";
    if (profileEmailElement) profileEmailElement.textContent = this.currentUser.email || "Email não informado";
    
    // Atualiza os detalhes do perfil se o elemento existir
    if (profileDetailsElement) {
      // Cria uma lista com os detalhes do usuário
      let detailsHTML = "";
      
      // Adiciona os dados pessoais
      if (this.currentUser.birthDate) detailsHTML += `<li><strong>Data de Nascimento:</strong> ${this.currentUser.birthDate}</li>`;
      if (this.currentUser.gender) detailsHTML += `<li><strong>Gênero:</strong> ${this.currentUser.gender}</li>`;
      if (this.currentUser.cpf) detailsHTML += `<li><strong>CPF:</strong> ${this.currentUser.cpf}</li>`;
      if (this.currentUser.phone) detailsHTML += `<li><strong>Telefone:</strong> ${this.currentUser.phone}</li>`;
      
      // Adiciona os dados de endereço
      if (this.currentUser.address) {
        const address = this.currentUser.address;
        let addressText = "";
        
        if (address.street) addressText += address.street;
        if (address.number) addressText += `, ${address.number}`;
        if (address.complement) addressText += ` - ${address.complement}`;
        if (address.city && address.state) addressText += `<br>${address.city}/${address.state}`;
        if (address.zipCode) addressText += ` - CEP: ${address.zipCode}`;
        
        if (addressText) detailsHTML += `<li><strong>Endereço:</strong> ${addressText}</li>`;
      }
      
      // Adiciona os dados de educação
      if (this.currentUser.education) {
        const education = this.currentUser.education;
        
        if (education.level) detailsHTML += `<li><strong>Nível de Escolaridade:</strong> ${education.level}</li>`;
        if (education.institution) detailsHTML += `<li><strong>Instituição:</strong> ${education.institution}</li>`;
        if (education.course) detailsHTML += `<li><strong>Curso:</strong> ${education.course}</li>`;
        if (education.period) detailsHTML += `<li><strong>Período:</strong> ${education.period}</li>`;
        if (education.shift) detailsHTML += `<li><strong>Turno:</strong> ${education.shift}</li>`;
      }
      
      // Atualiza o conteúdo do elemento
      profileDetailsElement.innerHTML = detailsHTML ? `<ul class="profile-details-list">${detailsHTML}</ul>` : "Nenhum detalhe disponível";
    }
  }
}

// Inicializa o sistema de autenticação quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  // Cria uma instância global do sistema de autenticação
  window.authSystem = new AuthSystem();
});


