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

// Calculadora Técnica de Insumos com Margem de Perda (+10%)
function calcularQuantitativos() {
  const comp = parseFloat(document.getElementById("comprimento").value);
  const larg = parseFloat(document.getElementById("largura").value);

  if (isNaN(comp) || isNaN(larg) || comp <= 0 || larg <= 0) {
    alert(
      "Por favor, informe medidas válidas de comprimento e largura (valores maiores que zero).",
    );
    return;
  }

  // 1. Cálculo da Área Líquida
  const areaLiquida = comp * larg;

  // 2. Acréscimo da Margem Técnica de 10% de Perda/Quebra
  const areaComPerda = areaLiquida * 1.1;

  // 3. Estimativa de Consumo Médio Padrão
  const argamassaKg = areaComPerda * 5.0; // 5 kg por m²
  const rejunteKg = areaComPerda * 0.5; // 0,5 kg por m²

  // Inserção dos dados calculados na tela
  document.getElementById("res-area").innerText = areaLiquida.toFixed(2);
  document.getElementById("res-piso").innerText = areaComPerda.toFixed(2);
  document.getElementById("res-argamassa").innerText = argamassaKg.toFixed(1);
  document.getElementById("res-rejunte").innerText = rejunteKg.toFixed(1);

  // Torna a caixa de resultados visível
  document.getElementById("resultado-calculo").classList.remove("d-none");
}

// Base Inicial de Relatórios de Vistoria (Portal do Cliente)
let relatorios = [
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

// Função para Renderizar a Linha do Tempo
function renderizarTimeline() {
  const container = document.getElementById("timeline-container");
  container.innerHTML = "";

  relatorios.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("timeline-item");
    div.innerHTML = `
      <div class="fw-bold text-gold small">${item.data}</div>
      <p class="mb-1 text-dark">${item.texto}</p>
      <span class="badge bg-light text-navy border">
        <i class="bi bi-paperclip me-1"></i> ${item.foto}
      </span>
    `;
    container.appendChild(div);
  });
}

// Função para o Engenheiro Publicar Nova Atualização
function adicionarRelatorio() {
  const texto = document.getElementById("relatorio-texto").value;
  const foto = document.getElementById("foto-url").value;

  if (texto.trim() === "") {
    alert("Digite as anotações técnicas da visita antes de publicar.");
    return;
  }

  const hoje = new Date().toLocaleDateString("pt-BR");

  // Adiciona a nova vistoria no topo da lista
  relatorios.unshift({
    data: hoje,
    texto: texto,
    foto: foto.trim() !== "" ? foto : "Registro fotográfico anexado",
  });

  // Atualiza visualmente a linha do tempo
  renderizarTimeline();

  // Limpa os campos do formulário
  document.getElementById("relatorio-texto").value = "";
  document.getElementById("foto-url").value = "";

  alert(
    "Vistoria publicada com sucesso! Ela já está visível no Portal do Cliente.",
  );
}

// Executa automaticamente ao carregar a página
window.onload = renderizarTimeline;
