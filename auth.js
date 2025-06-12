class AuthSystem {
  constructor() {
    this.init();
  }

  init() {
    this.checkLoginState();
    this.setupLoginForm();
    this.setupRegisterForm();
    this.updateUI();
  }

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

  getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  registerUser(userData) {
    const users = this.getUsers();
    if (users.find(user => user.email === userData.email)) {
      return { success: false, message: "Este email já está cadastrado." };
    }
    users.push(userData);
    this.saveUsers(users);
    this.login(userData.email);
    return { success: true, message: "Cadastro realizado com sucesso!" };
  }

  login(email, password = null) {
    const users = this.getUsers();
    if (password !== null) {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return { success: false, message: "Email ou senha inválidos." };
      }
    }
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUserEmail", email);
    this.checkLoginState(); // Atualiza o estado interno
    this.updateUI();
    return { success: true, message: "Login realizado com sucesso!" };
  }

  logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUserEmail");
    this.checkLoginState(); // Atualiza o estado interno
    this.updateUI();
    return { success: true, message: "Logout realizado com sucesso!" };
  }

  setupLoginForm() {
    const form = document.getElementById("register-form");
    if (!form) return;
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    newForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const result = this.login(newForm.email.value, newForm.senha.value);
      if (result.success) {
        document.getElementById("auth-modal")?.classList.add("hidden");
        window.location.href = "profile.html";
      } else {
        alert(result.message);
      }
    });
  }

  setupRegisterForm() {
    const form = document.getElementById("cadastroForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const userData = {
            email: form.email.value.trim(),
            password: form.senha.value,
            name: form.nome.value,
            birthDate: form.data_nascimento.value,
            gender: form.genero.value,
            cpf: form.cpf.value,
            phone: form.telefone.value,
            address: {
                zipCode: form.cep.value,
                street: form.endereco.value,
                number: form.numero.value,
                complement: form.complemento.value,
                city: form.cidade.value,
                state: form.estado.value
            },
            education: {
                level: form.escolaridade.value,
                institution: form.instituicao.value,
                course: form.curso.value,
                period: form.periodo.value,
                shift: form.turno.value
            }
        };
        const result = this.registerUser(userData);
        if (result.success) {
            alert(result.message);
            window.location.href = "profile.html";
        } else {
            alert(result.message);
        }
    });
  }

  updateUI() {
    const loginBtns = document.querySelectorAll(".nube-btn-login, .nube-btn-login_header");
    const registerBtns = document.querySelectorAll(".nube-btn-register, .nube-btn-register_header");
    const mainNav = document.querySelector(".nube-main-nav");
    const mobileNavAuth = document.querySelector(".nube-mobile-auth-buttons");

    // Limpa botões dinâmicos
    mainNav?.querySelector(".nube-btn-logout-header")?.remove();
    if (mobileNavAuth) mobileNavAuth.innerHTML = '';

    if (this.isLoggedIn) {
      // Logado: esconde login/cadastro, mostra logout
      loginBtns.forEach(btn => btn.style.display = 'none');
      registerBtns.forEach(btn => btn.style.display = 'none');
      
      if (mainNav) {
        const logoutBtn = document.createElement("button");
        logoutBtn.className = "nube-btn-logout-header";
        logoutBtn.textContent = "Sair";
        logoutBtn.addEventListener("click", () => this.logout() && (window.location.href = 'index.html'));
        mainNav.appendChild(logoutBtn);
      }
      if (mobileNavAuth) {
        const logoutBtnMobile = document.createElement("button");
        logoutBtnMobile.className = "nube-btn-logout-mobile";
        logoutBtnMobile.textContent = "Sair";
        logoutBtnMobile.addEventListener("click", () => this.logout() && (window.location.href = 'index.html'));
        mobileNavAuth.appendChild(logoutBtnMobile);
      }
    } else {
      // Deslogado: mostra login/cadastro
      loginBtns.forEach(btn => btn.style.display = '');
      registerBtns.forEach(btn => btn.style.display = '');
      
      if (mobileNavAuth) {
        const loginBtnMobile = document.createElement("button");
        loginBtnMobile.className = "nube-btn-login";
        loginBtnMobile.textContent = "Login";
        loginBtnMobile.addEventListener("click", () => document.getElementById("auth-modal")?.classList.remove("hidden"));
        mobileNavAuth.appendChild(loginBtnMobile);

        const registerBtnMobile = document.createElement("button");
        registerBtnMobile.className = "nube-btn-register";
        registerBtnMobile.textContent = "Cadastre-se";
        registerBtnMobile.addEventListener("click", () => window.location.href = 'cadastro.html');
        mobileNavAuth.appendChild(registerBtnMobile);
      }
    }
  }
}

new AuthSystem();