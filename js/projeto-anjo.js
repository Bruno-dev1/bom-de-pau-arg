(function () {
  "use strict";

  // ---- Sessão ----
  var chave = null;
  try { chave = sessionStorage.getItem("bp_usuario"); } catch (e) {}
  if (!chave) { window.location.replace("index.html"); return; }

  var nomes = { "fabio.magno": "F. MAGNO" };
  document.getElementById("usuario").textContent =
    nomes[chave] || chave.replace(".", " ").toUpperCase();

  document.getElementById("btn-sair").addEventListener("click", function () {
    try { sessionStorage.removeItem("bp_usuario"); sessionStorage.removeItem("bp_nome"); } catch (e) {}
    window.location.href = "index.html";
  });

  // Imagem ausente: não quebra o layout
  var img = document.getElementById("img-samael");
  img.addEventListener("error", function () {
    var f = img.closest(".foto");
    f.classList.add("sem-img");
    img.style.display = "none";
    f.insertAdjacentHTML("afterbegin",
      '<p class="mono sec">[ IMAGEM INDISPONÍVEL: img/samael-contido.png ]</p>');
  });

  // ---- Estados operacionais ----
  var ESTADOS = {
    estavel:  { rotulo: "ESTÁVEL" },
    moderado: { rotulo: "ATIVIDADE MODERADA" },
    instavel: { rotulo: "INSTÁVEL" },
    anomalo:  { rotulo: "ANÔMALO" }
  };
  var COR = { estavel: "#7f9a8a", moderado: "#a88a4e", instavel: "#b04a4a", anomalo: "#8b2323" };

  // ---- Registros ----
  var REGISTROS = [
    { id: "LOG-001", data: "12/01/2026", longa: "12 de janeiro de 2026", titulo: "Admissão e instalação",
      autor: "Equipe de Pesquisa C-07.", estado: "estavel", ativ: 12, ativRot: "BAIXA",
      corpo: [
        "A entidade foi transferida para a câmara de contenção do subnível 04.",
        "Foi instalada em uma estrutura de madeira reforçada, com geometria cruciforme. As extremidades dos membros e das estruturas alares foram imobilizadas por braçadeiras e correntes.",
        "Foram identificadas múltiplas formações oculares distribuídas pelas asas e uma estrutura ocular central.",
        "Não houve resposta a estímulos luminosos, sonoros ou térmicos."
      ],
      conclusao: "contenção inicial considerada satisfatória. Recomenda-se observação ininterrupta." },
    { id: "LOG-002", data: "12/02/2026", longa: "12 de fevereiro de 2026", titulo: "Resposta a estímulos",
      autor: "Dra. Helena Vilar — Biologia.", estado: "estavel", ativ: 22, ativRot: "BAIXA",
      corpo: [
        "Durante o ciclo de observação, três sensores registraram atividade simultânea sem alteração física aparente da entidade.",
        "A leitura foi inicialmente atribuída a interferência eletromagnética.",
        "O teste foi repetido com os instrumentos desconectados da rede principal. A atividade persistiu.",
        "Um técnico relatou ter escutado um ruído semelhante a uma inspiração profunda. A gravação não contém som correspondente."
      ],
      conclusao: "ampliar o monitoramento térmico." },
    { id: "LOG-003", data: "12/03/2026", longa: "12 de março de 2026", titulo: "Atividade ocular",
      autor: "Equipe de Neuroanálise.", estado: "moderado", ativ: 45, ativRot: "MODERADA",
      corpo: [
        "Às 02h16, as câmeras registraram movimentação independente dos olhos periféricos.",
        "Todos acompanharam o deslocamento do pesquisador responsável pela ronda.",
        "O olho central permaneceu fechado. Após a saída do funcionário, os olhos periféricos continuaram voltados para a porta por aproximadamente onze minutos."
      ],
      conclusao: "a entidade demonstra percepção visual distribuída. Recomenda-se evitar contato visual prolongado." },
    { id: "LOG-004", data: "12/04/2026", longa: "12 de abril de 2026", titulo: "Alteração morfológica",
      autor: "Dr. Raul Nascimento — Anatomia.", estado: "moderado", ativ: 58, ativRot: "MODERADA",
      corpo: [
        "Foram observadas contrações nas estruturas alares. A amplitude foi inferior a dois centímetros, mas suficiente para tensionar as correntes de fixação.",
        "Uma inspeção posterior revelou pequenas fissuras na madeira, concentradas ao redor dos pontos de ancoragem.",
        "Um membro da equipe afirmou que as asas pareciam respirar.",
        "Três funcionários descreveram a mesma impressão."
      ],
      conclusao: "reforçar os pontos de ancoragem e suspender inspeções presenciais." },
    { id: "LOG-005", data: "12/05/2026", longa: "12 de maio de 2026", titulo: "Incidente de monitoramento",
      autor: "Coordenação de Segurança C-07.", estado: "instavel", ativ: 78, ativRot: "ELEVADA",
      corpo: [
        "Às 03h17, o sinal de vídeo da câmara foi interrompido por quatro minutos e trinta e oito segundos.",
        "Quando a transmissão foi restabelecida, todas as correntes permaneciam tensionadas, mas a cabeça da entidade estava inclinada em direção à porta de observação.",
        "Nenhum funcionário possuía autorização para entrar na câmara durante o intervalo.",
        "Dois operadores relataram ter ouvido seus nomes pronunciados no corredor.",
        "O áudio ambiente não registrou voz humana."
      ],
      conclusao: "incidente em investigação. Acesso presencial suspenso." },
    { id: "LOG-006", data: "12/06/2025", longa: "12 de junho de 2025", titulo: "Relato da diretoria",
      autor: "Fábio Magnum — Diretoria.", estado: "anomalo", ativ: 96, ativRot: "CRÍTICA", critico: true,
      aviso: "Este documento não deve ser encaminhado à equipe de pesquisa.",
      corpo: [
        "Entrei na câmara às 04h12. Não autorizei que registrassem minha entrada.",
        "As correntes estavam no lugar. A estrutura não apresentava danos novos.",
        "Todos os olhos estavam voltados para mim.",
        "O olho central estava aberto.",
        "Samael falou antes que eu dissesse qualquer coisa. A voz não veio da boca. Veio da sala inteira.",
        { fala: "\u201CVocê demorou, Fábio.\u201D" },
        "Não houve tentativa de fuga. Não houve movimento das correntes. Ele apenas me observou.",
        "A equipe acredita que estamos estudando uma entidade contida. Ainda não compreendeu o que está acontecendo aqui.",
        "O Projeto Anjo está funcionando. Em breve, não precisaremos mais pedir permissão a ninguém."
      ],
      instrucao: "manter este registro fora do arquivo técnico. Qualquer menção à comunicação verbal deverá ser negada." }
  ];

  var linha = document.getElementById("linha");
  var doc = document.getElementById("doc");

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Monta a linha do tempo
  REGISTROS.forEach(function (r, i) {
    var li = document.createElement("li");
    li.innerHTML =
      '<button type="button" class="reg' + (r.critico ? " critico" : "") + '" role="tab" ' +
      'id="tab-' + i + '" aria-selected="false" aria-controls="doc" data-i="' + i + '">' +
      '<span class="ponto"></span>' +
      '<span class="data">' + r.data + '</span>' +
      '<span class="tit">' + esc(r.titulo) + '</span></button>';
    linha.appendChild(li);
  });

  function selecionar(i, foco) {
    var r = REGISTROS[i];

    // Destaque do registro atual
    var botoes = linha.querySelectorAll(".reg");
    botoes.forEach(function (b, k) {
      b.setAttribute("aria-selected", k === i ? "true" : "false");
      b.tabIndex = k === i ? 0 : -1;
    });
    if (foco) botoes[i].focus();

    // Documento
    var h = '<header class="doc-cab mono"><span class="id">' + r.id + ' — ' + r.data +
            '</span><span class="sec">' + esc(r.longa) + '</span></header>';
    if (r.aviso) h += '<p class="doc-aviso">' + esc(r.aviso) + '</p>';
    h += '<p class="doc-autor"><b>Autor:</b> ' + esc(r.autor) + '</p><div class="doc-corpo">';
    r.corpo.forEach(function (p) {
      h += typeof p === "string" ? '<p>' + esc(p) + '</p>' : '<p class="fala">' + esc(p.fala) + '</p>';
    });
    if (r.conclusao) h += '<p class="conclusao"><b>Conclusão:</b> ' + esc(r.conclusao) + '</p>';
    if (r.instrucao) h += '<p class="conclusao instr"><b>Instrução:</b> ' + esc(r.instrucao) + '</p>';
    h += '</div>';
    doc.innerHTML = h;
    doc.setAttribute("aria-labelledby", "tab-" + i);
    doc.classList.remove("entra"); void doc.offsetWidth; doc.classList.add("entra");

    // Condição operacional
    var box = document.getElementById("estado-box");
    box.setAttribute("data-s", r.estado);
    document.getElementById("estado-txt").textContent = ESTADOS[r.estado].rotulo;
    document.getElementById("ativ-txt").textContent = r.ativRot;
    var ba = document.getElementById("barra-ativ");
    ba.style.width = r.ativ + "%";
    ba.style.background = COR[r.estado];
    document.getElementById("atualizacao").textContent = r.data;

    // A atmosfera se intensifica conforme o avanço pelos registros
    document.body.setAttribute("data-nivel", String(i));
  }

  linha.addEventListener("click", function (ev) {
    var b = ev.target.closest(".reg");
    if (b) selecionar(parseInt(b.getAttribute("data-i"), 10), false);
  });
  linha.addEventListener("keydown", function (ev) {
    var atual = parseInt(linha.querySelector('.reg[aria-selected="true"]').getAttribute("data-i"), 10);
    var n = REGISTROS.length, novo = null;
    if (ev.key === "ArrowRight" || ev.key === "ArrowDown") novo = (atual + 1) % n;
    if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") novo = (atual - 1 + n) % n;
    if (novo !== null) { ev.preventDefault(); selecionar(novo, true); }
  });

  selecionar(0, false);
})();
