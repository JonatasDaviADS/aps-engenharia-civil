// Mostra uma mensagem dentro da página (no lugar do alert(), que trava a tela).
// tipo: "warning" (amarelo), "success" (verde), "danger" (vermelho)
function mostrarAviso(idElemento, mensagem, tipo) {
  const caixa = document.getElementById(idElemento);
  caixa.className = `alert alert-${tipo} py-2 small mt-3`;
  caixa.textContent = mensagem;
  // Mensagem de sucesso some sozinha depois de 4 segundos
  if (tipo === "success") {
    setTimeout(() => caixa.classList.add("d-none"), 4000);
  }
}

// Lê um dado salvo no navegador (localStorage).
// Se não existir, ou se o navegador bloquear, devolve o valor "padrao".
function carregarJSON(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave);
    return texto ? JSON.parse(texto) : padrao;
  } catch (erro) {
    return padrao;
  }
}

// Salva qualquer lista/objeto no navegador, convertido para texto JSON.
function salvarJSON(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    // sem armazenamento: o sistema continua funcionando, só não guarda
  }
}

// Cria um elemento HTML de forma SEGURA.
// textContent trata o texto como TEXTO, nunca como código (evita XSS).
function criarElemento(tag, texto, classes) {
  const elemento = document.createElement(tag);
  if (texto !== undefined && texto !== null) elemento.textContent = texto;
  if (classes) elemento.className = classes;
  return elemento;
}

// Controle de Alternância de Abas na Interface
function trocarAba(abaId) {
  // Oculta todas as seções
  document.getElementById("aba-institucional").classList.add("d-none");
  document.getElementById("aba-engenheiro").classList.add("d-none");
  document.getElementById("aba-cliente").classList.add("d-none");

  // Remove estado ativo de todos os botões da barra superior
  document.getElementById("btn-tab-institucional").classList.remove("active");
  document.getElementById("btn-tab-engenheiro").classList.remove("active");
  document.getElementById("btn-tab-cliente").classList.remove("active");

  // Mostra a aba clicada e ativa o botão correspondente
  document.getElementById(`aba-${abaId}`).classList.remove("d-none");
  document.getElementById(`btn-tab-${abaId}`).classList.add("active");
}

// Calculadora Técnica de Insumos com Margem de Perda (RF04)
function calcularQuantitativos() {
  const comp = parseFloat(document.getElementById("comprimento").value);
  const larg = parseFloat(document.getElementById("largura").value);

  // Validação: se algo estiver errado, avisa, esconde resultado antigo e PARA
  if (isNaN(comp) || isNaN(larg) || comp <= 0 || larg <= 0) {
    mostrarAviso(
      "aviso-calc",
      "Informe comprimento e largura maiores que zero.",
      "warning",
    );
    document.getElementById("resultado-calculo").classList.add("d-none");
    return;
  }
  document.getElementById("aviso-calc").classList.add("d-none");

  // 1. Área Líquida (m²)
  const areaLiquida = comp * larg;

  // 2. Área com a margem de perda: 1 (=100%) + 0,10 (=10%) = 1,10
  const areaComPerda = areaLiquida * (1 + CONFIG.perdaTecnica);

  // 3. Consumo estimado de insumos (valores vêm do config.js)
  const argamassaKg = areaComPerda * CONFIG.consumoArgamassaKgM2;
  const rejunteKg = areaComPerda * CONFIG.consumoRejunteKgM2;

  // 4. Mostra os resultados na tela (toFixed = quantidade de casas decimais)
  document.getElementById("res-area").textContent = areaLiquida.toFixed(2);
  document.getElementById("res-piso").textContent = areaComPerda.toFixed(2);
  document.getElementById("res-argamassa").textContent = argamassaKg.toFixed(1);
  document.getElementById("res-rejunte").textContent = rejunteKg.toFixed(1);
  // Torna a caixa de resultados visível
  document.getElementById("resultado-calculo").classList.remove("d-none");
}

// ---------- Diário de campo (RF03) e Portal do Cliente (RF06) ----------

const CHAVE_RELATORIOS = "aps.relatorios";

// Relatórios de exemplo (FICTÍCIOS), usados na primeira vez que o sistema abre
const RELATORIOS_EXEMPLO = [
  {
    data: "14/10/2026",
    texto:
      "Vistoria inicial concluída. Registro fotográfico do canteiro anexado e medições dos cômodos validadas com o contratante.",
    foto: "Foto 01: Esquadrias e prumo de parede conferidos",
  },
  {
    data: "10/10/2026",
    texto:
      "Abertura formal do projeto e assinatura da ordem de serviço com regime de reembolso de materiais.",
    foto: "Doc: Contrato assinado pelas partes",
  },
];

// Carrega do navegador. Se for a 1ª vez, usa uma CÓPIA dos exemplos.
let relatorios = carregarJSON(CHAVE_RELATORIOS, [...RELATORIOS_EXEMPLO]);

// Desenha a linha do tempo (de forma segura, sem innerHTML com texto digitado)
function renderizarTimeline() {
  const container = document.getElementById("timeline-container");
  container.innerHTML = ""; // aqui é seguro: só estamos APAGANDO

  relatorios.forEach((item) => {
    const bloco = criarElemento("div", null, "timeline-item");
    bloco.appendChild(
      criarElemento("div", item.data, "fw-bold text-gold small"),
    );
    bloco.appendChild(criarElemento("p", item.texto, "mb-1 text-dark"));

    const selo = criarElemento("span", null, "badge bg-light text-navy border");
    selo.appendChild(criarElemento("i", null, "bi bi-paperclip me-1"));
    selo.appendChild(document.createTextNode(item.foto));
    bloco.appendChild(selo);

    container.appendChild(bloco);
  });
}

// Engenheiro publica uma nova vistoria
function adicionarRelatorio() {
  const texto = document.getElementById("relatorio-texto").value.trim();
  const foto = document.getElementById("foto-url").value.trim();

  if (texto === "") {
    mostrarAviso(
      "aviso-diario",
      "Digite as anotações técnicas da visita antes de publicar.",
      "warning",
    );
    return;
  }

  // unshift = adiciona no INÍCIO da lista (a mais recente aparece primeiro)
  relatorios.unshift({
    data: new Date().toLocaleDateString("pt-BR"),
    texto: texto,
    foto: foto !== "" ? foto : "Registro fotográfico anexado",
  });

  salvarJSON(CHAVE_RELATORIOS, relatorios); // guarda no navegador
  renderizarTimeline();

  document.getElementById("relatorio-texto").value = "";
  document.getElementById("foto-url").value = "";
  mostrarAviso(
    "aviso-diario",
    "Vistoria publicada! Ela já está visível no Portal do Cliente.",
    "success",
  );
}

// Volta aos dados de exemplo (use antes de apresentar)
function restaurarExemplos() {
  relatorios = [...RELATORIOS_EXEMPLO];
  salvarJSON(CHAVE_RELATORIOS, relatorios);
  renderizarTimeline();
}

// Desenha a linha do tempo assim que o HTML terminar de carregar
document.addEventListener("DOMContentLoaded", renderizarTimeline);

// Monta o link do WhatsApp usando os valores do config.js
function configurarWhatsapp() {
  const link = document.getElementById("link-whatsapp");
  const mensagem = encodeURIComponent(CONFIG.whatsappMensagem);
  link.href = `https://wa.me/${CONFIG.whatsappNumero}?text=${mensagem}`;
}

// Executa a função assim que o HTML terminar de ser lido
document.addEventListener("DOMContentLoaded", configurarWhatsapp);
