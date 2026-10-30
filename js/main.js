/* ── Menu mobile ────────────────────────────────────────────────────────── */
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/* ── Autenticação — usuários locais ─────────────────────────────────────── */
// Para adicionar ou alterar usuários, edite o array abaixo.
const USUARIOS = [
  { usuario: "fabio.magno",  senha: "6384e2b2184bcbf58eccf10ca7a6563c", nome: "Fábio Magno"  },
  { usuario: "cliente01",    senha: "Madeira@123",   nome: "Cliente Demo"  },
  { usuario: "admin",        senha: "admin123",       nome: "Administrador" },
];

// Retorna o usuário correspondente ou null
function autenticar(usuario, senha) {
  return USUARIOS.find(
    (u) => u.usuario === usuario.trim() && u.senha === senha
  ) ?? null;
}

function md5(senha){
  let resp =""
  senha.forEach(letter => {
    letter+="9";
    resp+= letter
  });
  return letter
}

/* ── Elementos do DOM ───────────────────────────────────────────────────── */
const btnAbrirLogin   = document.getElementById("btn-open-login");
const loginModal      = document.getElementById("login-modal");
const btnFecharLogin  = document.getElementById("btn-close-login");
const loginForm       = document.getElementById("login-form");
const inputUsuario    = document.getElementById("login-user");
const inputSenha      = document.getElementById("login-pass");
const erroLogin       = document.getElementById("login-error");

const painelModal     = document.getElementById("painel-modal");
const btnFecharPainel = document.getElementById("btn-close-painel");
const btnLogout       = document.getElementById("btn-logout");
const painelNome      = document.getElementById("painel-nome");

/* ── Helpers de modal ───────────────────────────────────────────────────── */
function abrirModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  // foca o primeiro elemento interativo
  const primeiro = modal.querySelector("button, input");
  if (primeiro) primeiro.focus();
}

function fecharModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = "";
}

// Fecha ao clicar no overlay (fora da caixa)
[loginModal, painelModal].forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal(modal);
  });
});

// Fecha com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!loginModal.hidden)  fecharModal(loginModal);
    if (!painelModal.hidden) fecharModal(painelModal);
  }
});

/* ── Abrir / fechar login ────────────────────────────────────────────────── */
btnAbrirLogin.addEventListener("click", () => {
  // Se já estiver logado, abre direto o painel
  const sessao = sessionStorage.getItem("bp_usuario");
  if (sessao) {
    painelNome.textContent = sessionStorage.getItem("bp_nome") ?? sessao;
    abrirModal(painelModal);
  } else {
    loginForm.reset();
    erroLogin.hidden = true;
    inputUsuario.classList.remove("input-error");
    inputSenha.classList.remove("input-error");
    abrirModal(loginModal);
  }
});

btnFecharLogin.addEventListener("click",  () => fecharModal(loginModal));
btnFecharPainel.addEventListener("click", () => fecharModal(painelModal));

/* ── Submit do formulário ───────────────────────────────────────────────── */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = inputUsuario.value;
  const senha   = md5(inputSenha.value);
  const encontrado = autenticar(usuario, senha);

  if (!encontrado) {
    erroLogin.hidden = false;
    inputUsuario.classList.add("input-error");
    inputSenha.classList.add("input-error");
    inputUsuario.focus();
    return;
  }

  // Login bem-sucedido — salva na sessão e abre o painel
  sessionStorage.setItem("bp_usuario", encontrado.usuario);
  sessionStorage.setItem("bp_nome",    encontrado.nome);

  fecharModal(loginModal);
  painelNome.textContent = encontrado.nome;
  abrirModal(painelModal);

  // Limpa o formulário por segurança
  loginForm.reset();
  erroLogin.hidden = true;
  inputUsuario.classList.remove("input-error");
  inputSenha.classList.remove("input-error");
});

// Remove destaque de erro ao digitar novamente
[inputUsuario, inputSenha].forEach((campo) => {
  campo.addEventListener("input", () => {
    campo.classList.remove("input-error");
    erroLogin.hidden = true;
  });
});

/* ── Mostrar / ocultar senha ─────────────────────────────────────────────── */
document.querySelectorAll(".toggle-pass").forEach((btn) => {
  btn.addEventListener("click", () => {
    const alvo = document.getElementById(btn.dataset.target);
    if (!alvo) return;
    const visivel = alvo.type === "text";
    alvo.type = visivel ? "password" : "text";
    btn.setAttribute("aria-label", visivel ? "Mostrar senha" : "Ocultar senha");
    btn.querySelector("span").textContent = visivel ? "👁" : "🙈";
  });
});

/* ── Logout ──────────────────────────────────────────────────────────────── */
btnLogout.addEventListener("click", () => {
  sessionStorage.removeItem("bp_usuario");
  sessionStorage.removeItem("bp_nome");
  fecharModal(painelModal);
});
