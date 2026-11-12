// ===============================================================
// obras.js: cadastro de obras pelo engenheiro (Supabase)
// Depende de: supabase-client.js. O RLS do banco garante que só
// o engenheiro consegue gravar; aqui é só a interface.
// ===============================================================

// Mostra mensagem no card. tipo: | "sucess" | "warning"
function mostrarMensagemObra(texto, tipo) {
  const caixa = document.getElementById("obra-msg");
  caixa.className = `alert alert-${tipo} mt-3`; // cor (Bootstrap)
  caixa.textContent = texto; // textContent envia o injetar HTML
}

// Preenche a lista de clientes (vem da tabela "perfis")
async function carregarClinetes() {
  const select = document.getElementById("obra-cliente");

  const { data, error } = await clienteSupabase
    .from("perfis") // tabela
    .select("id, nome") // colunas
    .eq("papel", "cliente") // só quem é cliente
    .order("nome"); // ordem alfabética

  select.innerHTML = ""; // limpa as opções antigas

  const primeira = document.createElement("option");
  primeira.value = "";
  primeira.textContent = error
    ? "Erro ao carregar clientes"
    : "Seleciona o cliente";
  select.appendChild(primeira);

  if (error) return; /// para aqui se deu erro

  data.forEach((cliente) => {
    const opcao = document.createElement("option");
    opcao.value = cliente.id; // o que vai para o banco
    opcao.textContent = cliente.nome || cliente.id; // o que aparece
    select.appendChild(opcao);
  });
}
// Chamada quando o formulário é enviado
async function cadastrarObra(evento) {
  evento.preventDefault(); // impede a página de recarregar

  const nome = document.getElementById("obra-nome").value.trim();
  const localObra = document.getElementById("obra-local").value.trim();
  const regime = document.getElementById("obra-regime").value;
  const clienteId = document.getElementById("obra-cliente").value;

  if (!nome || !clienteId) {
    mostrarMensagemObra(
      "Informe o nome da obra e escolha o cliente.",
      "warning",
    );
    return; // para aqui
  }

  const botao = document.getElementById("btn-cadastrar-obra");
  botao.disabled = true; // evita clique duplo

  const { data, error } = await clienteSupabase
    .from("obras")
    .insert({
      nome: nome,
      local: localObra,
      regime: regime,
      cliente_id: clienteId,
    })
    .select("codigo, nome") // devolve o código gerado pelo banco
    .single();

  botao.disabled = false;

  if (error) {
    console.error(error); // detalhes só no Console
    mostrarMensagemObra("Não foi possível cadastrar a obra.", "danger");
    return;
  }

  mostrarMensagemObra(
    `Obra cadastrada: ${data.codigo} (${data.nome}).`,
    "success",
  );
  document.getElementById("form-obra").reset(); // limpa o formulário
}

// Liga o formulário quando a página termina de carregar
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("form-obra")
    .addEventListener("submit", cadastrarObra);
});
