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
// As senhas são armazenadas como MD5. Use gerarMD5("suaSenha") no console para obter o hash.
const USUARIOS = [
  { usuario: "fabio.magno",  senha: "6384e2b2184bcbf58eccf10ca7a6563c", nome: "Fábio Magno",  redir: "projeto-anjo.html" },
  { usuario: "cliente01",   senha: "e49f6f3f23c8b7ceacac0b1b9e2a05ab", nome: "Cliente Demo",  redir: null },
  { usuario: "admin",       senha: "0192023a7bbd73250516f069df18b500", nome: "Administrador", redir: null },
];

// Retorna o usuário correspondente ou null
function autenticar(usuario, senha) {
  return USUARIOS.find(
    (u) => u.usuario === usuario.trim() && u.senha === senha
  ) ?? null;
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
function gerarMD5(texto) {
    function rotateLeft(x, n) {
        return (x << n) | (x >>> (32 - n));
    }

    function addUnsigned(x, y) {
        return (x + y) >>> 0;
    }

    const K = [];
    for (let i = 0; i < 64; i++) {
        K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;
    }

    const S = [
        7, 12, 17, 22, 7, 12, 17, 22,
        7, 12, 17, 22, 7, 12, 17, 22,
        5, 9, 14, 20, 5, 9, 14, 20,
        5, 9, 14, 20, 5, 9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23,
        4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21,
        6, 10, 15, 21, 6, 10, 15, 21
    ];

    const bytes = new TextEncoder().encode(texto);
    const originalLength = bytes.length;

    const paddedLength = Math.ceil((originalLength + 9) / 64) * 64;
    const buffer = new Uint8Array(paddedLength);

    buffer.set(bytes);
    buffer[originalLength] = 0x80;

    const bitLength = originalLength * 8;
    const view = new DataView(buffer.buffer);

    view.setUint32(paddedLength - 8, bitLength >>> 0, true);
    view.setUint32(paddedLength - 4, Math.floor(bitLength / 4294967296), true);

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    for (let offset = 0; offset < paddedLength; offset += 64) {
        const M = [];

        for (let i = 0; i < 16; i++) {
            M[i] = view.getUint32(offset + i * 4, true);
        }

        let A = a0;
        let B = b0;
        let C = c0;
        let D = d0;

        for (let i = 0; i < 64; i++) {
            let F, g;

            if (i < 16) {
                F = (B & C) | (~B & D);
                g = i;
            } else if (i < 32) {
                F = (D & B) | (~D & C);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                F = B ^ C ^ D;
                g = (3 * i + 5) % 16;
            } else {
                F = C ^ (B | ~D);
                g = (7 * i) % 16;
            }

            const temp = D;
            D = C;
            C = B;

            const sum = addUnsigned(
                addUnsigned(A, F >>> 0),
                addUnsigned(K[i], M[g])
            );

            B = addUnsigned(B, rotateLeft(sum, S[i]));

            A = temp;
        }

        a0 = addUnsigned(a0, A);
        b0 = addUnsigned(b0, B);
        c0 = addUnsigned(c0, C);
        d0 = addUnsigned(d0, D);
    }

    function toHex(value) {
        return [0, 8, 16, 24]
            .map(shift => ((value >>> shift) & 0xff)
                .toString(16).padStart(2, "0"))
            .join("");
    }

    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
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
  const senha   = gerarMD5(inputSenha.value);
  const encontrado = autenticar(usuario, senha);

  if (!encontrado) {
    erroLogin.hidden = false;
    inputUsuario.classList.add("input-error");
    inputSenha.classList.add("input-error");
    inputUsuario.focus();
    return;
  }

  // Login bem-sucedido — salva a sessão
  sessionStorage.setItem("bp_usuario", encontrado.usuario);
  sessionStorage.setItem("bp_nome",    encontrado.nome);

  // Limpa o formulário por segurança
  loginForm.reset();
  erroLogin.hidden = true;
  inputUsuario.classList.remove("input-error");
  inputSenha.classList.remove("input-error");

  // Usuários com página própria são redirecionados diretamente
  if (encontrado.redir) {
    window.location.href = encontrado.redir;
    return;
  }

  // Demais usuários: abre o painel na mesma página
  fecharModal(loginModal);
  painelNome.textContent = encontrado.nome;
  abrirModal(painelModal);
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
  // Reabre o formulário de login limpo
  loginForm.reset();
  erroLogin.hidden = true;
  inputUsuario.classList.remove("input-error");
  inputSenha.classList.remove("input-error");
  abrirModal(loginModal);
});
