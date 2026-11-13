// ===============================================================
// auth.js: login, logout e leitura do perfil (Supabase Auth)
// Depende de: supabase-client.js (precisa carregar ANTES)
// ===============================================================

// Mostra uma mensagem na tela de login. tipo: "danger" | "success" | "warning"
function mostrarMensagemLogin(texto, tipo) {
  const caixa = document.getElementById("login-msg");
  caixa.className = `alert alert-${tipo} mt-3`; // cor da mensagem (Bootstrap)
  caixa.textContent = texto; // textContent evita injetar HTML (segurança)
}

// Esconde a mensagem
function limparMensagemLogin() {
  const caixa = document.getElementById("login-msg");
  caixa.className = "mt-3";
  caixa.textContent = "";
}

// Busca nome e papel da pessoa logada na tabela "perfis"
async function buscarPerfil(userId) {
  const { data, error } = await clienteSupabase
    .from("perfis") // tabela
    .select("nome, papel") // colunas que queremos
    .eq("id", userId) // só a linha desta pessoa
    .single(); // esperamos exatamente 1 linha
  if (error) return null; // sem perfil ou erro
  return data;
}

// Chamada quando o formulário é enviado (clique em "Entrar")
async function entrar(evento) {
  evento.preventDefault(); // impede a página de recarregar

  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value;

  if (!email || !senha) {
    mostrarMensagemLogin("Informe e-mail e senha.", "warning");
    return; // para aqui
  }

  const botao = document.getElementById("btn-entrar");
  botao.disabled = true; // evita o clique duplo

  const { error } = await clienteSupabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  botao.disabled = false;
  if (error) {
    // mensagem genérica: não revela se o e-mail existe
    mostrarMensagemLogin("E-mail ou senha incorretos.", "danger");
    return;
  }

  document.getElementById("login-senha").value = ""; // limpa a senha da tela
  await atualizarTelaLogin(); // mostra o estado "logado"
  mostrarMensagemLogin("Login realizado com sucesso.", "success");
}

// Chamada no clique em "Sair"
async function sair() {
  await clienteSupabase.auth.signOut(); // apaga a sessão
  await atualizarTelaLogin(); // volta ao formulário
  limparMensagemLogin();
}

// Quais abas cada papel pode ver (ids das abas do index.html)
const ABAS_POR_PAPEL = {
  visitante: ["institucional", "login"],
  cliente: ["institucional", "cliente", "login"],
  engenheiro: ["institucional", "engenheiro", "orcamento", "cliente", "login"],
};

// Papel de quem está usando o site agora (muda ao logar/sair)
let papelAtual = "visitante";

// Responde: o papel atual pode abrir esta aba?
function podeAcessarAba(id) {
  return ABAS_POR_PAPEL[papelAtual].includes(id);
}

// Mostra/esconde os botões do menu conforme o papel
function aplicarPermissoes(papel) {
  // guarda o papel atual (se for desconhecido, vale visitante)
  papelAtual = ABAS_POR_PAPEL[papel] ? papel : "visitante";
  // se o papel for desconhecido, trata como visitante (mais restrito)
  const permitidas = ABAS_POR_PAPEL[papel] || ABAS_POR_PAPEL.visitante;
  const todas = ABAS_POR_PAPEL.engenheiro; // a lista completa de abas

  todas.forEach((id) => {
    // esconde o botão se a aba NÃO está na lista permitida
    document
      .getElementById(`btn-tab-${id}`)
      .classList.toggle("d-none", !permitidas.includes(id));
  });

  // se a aba aberta agora não é permitida, volta para a vitrine
  const abaAberta = todas.find(
    (id) => !document.getElementById(`aba-${id}`).classList.contains("d-none"),
  );
  if (abaAberta && !permitidas.includes(abaAberta)) {
    trocarAba("institucional");
  }
}

// Mostra o formulário OU o painel "logado", conforme a sessão
async function atualizarTelaLogin() {
  const { data } = await clienteSupabase.auth.getSession();
  const sessao = data.session; // null se ninguém logado

  const form = document.getElementById("form-login");
  const painel = document.getElementById("login-logado");

  if (!sessao) {
    form.classList.remove("d-none"); // mostra formulário
    painel.classList.add("d-none"); // esconde painel
    aplicarPermissoes("visitante"); // menu de visitante
    return;
  }

  const perfil = await buscarPerfil(sessao.user.id);
  document.getElementById("login-quem").textContent =
    (perfil && perfil.nome) || sessao.user.email;
  document.getElementById("login-papel").textContent = perfil
    ? perfil.papel
    : "sem perfil";

  form.classList.add("d-none"); // esconde formulário
  painel.classList.remove("d-none"); // mostra painel
  aplicarPermissoes(perfil ? perfil.papel : "visitante"); // menu do papel
  if (perfil && perfil.papel === "engenheiro") carregarClientes(); // lista do cadastro de obra
}

// Liga os botões quando a página termina de carregar
document.addEventListener("DOMContentLoaded", () => {
  aplicarPermissoes("visitante"); // começa restrito, evita "piscar" o menu
  document.getElementById("form-login").addEventListener("submit", entrar);
  document.getElementById("btn-sair").addEventListener("click", sair);
  atualizarTelaLogin(); // ajusta o menu conforme a sessão salva
});
