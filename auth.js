class AuthSystem {
  constructor() {
    this.init();
  }

  // Inicializa o sistema e configura os listeners
  init() {
    this.checkLoginState();
    this.setupLoginForm();
    this.setupRegisterForm();
    this.setupPasswordToggles(); // <-- 1. ADICIONE A CHAMADA PARA A NOVA FUNÇÃO AQUI
    this.updateUI();
  }

  // Verifica o estado de login atual
  checkLoginState() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    this.currentUserEmail = localStorage.getItem("loggedInUserEmail");

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
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      return { success: false, message: "Este email já está cadastrado." };
    }

    users.push(userData);
    this.saveUsers(users);
    this.login(userData.email);
    return { success: true, message: "Cadastro realizado com sucesso!" };
  }

  // Realiza o login do usuário
  login(email, password = null) {
    const users = this.getUsers();
    if (password !== null) {
      const user = users.find(user => user.email === email && user.password === password);
      if (!user) {
        return { success: false, message: "Email ou senha inválidos." };
      }
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUserEmail", email);
    this.isLoggedIn = true;
    this.currentUserEmail = email;
    this.currentUser = users.find(user => user.email === email);
    this.updateUI();
    return { success: true, message: "Login realizado com sucesso!" };
  }

  // Realiza o logout do usuário
  logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUserEmail");
    this.isLoggedIn = false;
    this.currentUserEmail = null;
    this.currentUser = null;
    this.updateUI();
    return { success: true, message: "Logout realizado com sucesso!" };
  }

  // Configura o formulário de login
  setupLoginForm() {
    const loginForm = document.getElementById("register-form");
    if (!loginForm) return;

    const newLoginForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);

    newLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newLoginForm.email.value.trim();
      const password = newLoginForm.senha.value;
      const result = this.login(email, password);

      if (result.success) {
        const modal = document.getElementById("auth-modal");
        if (modal) modal.classList.add("hidden");
        window.location.href = "profile.html";
      } else {
        alert(result.message);
      }
    });
  }

 
  setupRegisterForm() {
    const registerForm = document.getElementById("cadastroForm");
    if (!registerForm) return;

    const newRegisterForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newRegisterForm, registerForm);

    const birthDateInput = newRegisterForm.querySelector('[name="data_nascimento"]');
    if (birthDateInput) {
      birthDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
          value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        if (value.length > 5) {
          value = `${value.slice(0, 5)}/${value.slice(5, 9)}`;
        }
        e.target.value = value;
      });
    }

    newRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userData = {
        email: newRegisterForm.querySelector('[name="email"]')?.value.trim() || "",
        password: newRegisterForm.querySelector('[name="senha"]')?.value || "",
        name: newRegisterForm.querySelector('[name="nome"]')?.value || "",
        birthDate: newRegisterForm.querySelector('[name="data_nascimento"]')?.value || "",
        gender: newRegisterForm.querySelector('[name="genero"]')?.value || "",
        cpf: newRegisterForm.querySelector('[name="cpf"]')?.value || "",
        phone: newRegisterForm.querySelector('[name="telefone"]')?.value || "",
        address: {
          zipCode: newRegisterForm.querySelector('[name="cep"]')?.value || "",
          street: newRegisterForm.querySelector('[name="endereco"]')?.value || "",
          number: newRegisterForm.querySelector('[name="numero"]')?.value || "",
          complement: newRegisterForm.querySelector('[name="complemento"]')?.value || "",
          city: newRegisterForm.querySelector('[name="cidade"]')?.value || "",
          state: newRegisterForm.querySelector('[name="estado"]')?.value || ""
        },
        education: {
          level: newRegisterForm.querySelector('[name="escolaridade"]')?.value || "",
          institution: newRegisterForm.querySelector('[name="instituicao"]')?.value || "",
          course: newRegisterForm.querySelector('[name="curso"]')?.value || "",
          period: newRegisterForm.querySelector('[name="periodo"]')?.value || "",
          shift: newRegisterForm.querySelector('[name="turno"]')?.value || ""
        }
      };

      if (!userData.email || !userData.password || !userData.name) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const result = this.registerUser(userData);

      if (result.success) {
        alert(result.message);
        window.location.href = "index.html";
      } else {
        if (result.message === "Este email já está cadastrado.") {
          if (confirm("Este email já está cadastrado. Deseja ir para a página de login?")) {
            window.location.href = "index.html";
          }
        } else {
          alert(result.message);
        }
      }
    });
  }

  // Atualiza TODA a interface com base no estado de login
  updateUI() {
    this.checkLoginState();

    const loginBtnsHeader = document.querySelectorAll(".nube-btn-login, .nube-btn-login_header");
    const registerBtnsHeader = document.querySelectorAll(".nube-btn-register, .nube-btn-register_header");
    const profileLinks = document.querySelectorAll('a[href="profile.html"]');
    const mainNav = document.querySelector(".nube-main-nav");
    const mobileNavAuthContainer = document.querySelector(".nube-mobile-auth-buttons");

    const existingLogoutHeader = mainNav?.querySelector(".nube-btn-logout-header");
    if (existingLogoutHeader) existingLogoutHeader.remove();
    if (mobileNavAuthContainer) mobileNavAuthContainer.innerHTML = '';

    if (this.isLoggedIn) {
      loginBtnsHeader.forEach(btn => btn.style.display = "none");
      registerBtnsHeader.forEach(btn => btn.style.display = "none");
      profileLinks.forEach(link => link.style.display = "");

      if (mainNav) {
        const logoutBtnHeader = document.createElement("button");
        logoutBtnHeader.className = "nube-btn-logout-header";
        logoutBtnHeader.textContent = `Sair (${this.currentUserEmail.split("@")[0] || ""})`;
        logoutBtnHeader.addEventListener("click", () => {
          this.logout();
          window.location.href = "index.html";
        });
        mainNav.appendChild(logoutBtnHeader);
      }

      if (mobileNavAuthContainer) {
        const logoutBtnMobile = document.createElement("button");
        logoutBtnMobile.className = "nube-btn-logout-mobile";
        logoutBtnMobile.textContent = `Sair (${this.currentUserEmail.split("@")[0] || ""})`;
        logoutBtnMobile.addEventListener("click", () => {
          this.logout();
          window.location.href = "index.html";
        });
        mobileNavAuthContainer.appendChild(logoutBtnMobile);
      }

    } else {
      loginBtnsHeader.forEach(btn => btn.style.display = "");
      registerBtnsHeader.forEach(btn => btn.style.display = "");
      profileLinks.forEach(link => link.style.display = "none");

      if (mobileNavAuthContainer) {
        const loginBtnMobile = document.createElement("button");
        loginBtnMobile.className = "nube-btn-login";
        loginBtnMobile.textContent = "Login";
        loginBtnMobile.addEventListener("click", () => {
          const modal = document.getElementById("auth-modal");
          if (modal) {
            modal.querySelector("h2").textContent = "Login";
            modal.querySelector('button[type="submit"]').textContent = "Entrar";
            modal.classList.remove("hidden");
          }

          const mobileNav = document.getElementById("nube-mobile-nav");
          if (mobileNav) mobileNav.classList.remove("is-open");

          const overlay = document.getElementById("mobile-nav-overlay");
          if (overlay) overlay.style.display = "none";

          document.body.style.overflow = "";
        });
        mobileNavAuthContainer.appendChild(loginBtnMobile);

        const registerBtnMobile = document.createElement("button");
        registerBtnMobile.className = "nube-btn-register";
        registerBtnMobile.textContent = "Cadastre-se";
        registerBtnMobile.addEventListener("click", () => {
          window.location.href = "cadastro.html";
        });
        mobileNavAuthContainer.appendChild(registerBtnMobile);
      }
    }
  }
}