// =====================================================================
// config.js — Configurações do sistema em UM único lugar
// Se um valor mudar (ex.: número do WhatsApp), altera-se só aqui.
// =====================================================================

const CONFIG = {
  // TROCAR pelo número real SOMENTE depois que o Alexandre autorizar.
  // Formato: 55 + DDD + número, sem espaços. Ex.: "5551912345678"
  whatsappNumero: "5551999999999",
  whatsappMensagem:
    "Olá Engenheiro Alexandre, gostaria de um orçamento técnico.",

  // Regras de negócio da calculadora (com nome, em vez de "números soltos")
  perdaTecnica: 0.1, // 10% de quebra/perda, regra relatada pelo Alexandre
  consumoArgamassaKgM2: 5.0, // A VALIDAR com o Alexandre
  consumoRejunteKgM2: 0.5, // A VALIDAR com o Alexandre

  // Dados do responsável técnico, usados depois no orçamento
  responsavelPadrao: "Eng. Civil - Alexandre P. Santos",
  creaPadrao: "CREA/RS 133612",
};
// Obras FICTÍCIAS, só para demonstração (nenhum cliente real).
// A chave ("a", "b") identifica a obra; os relatórios usam essa chave.
const OBRAS = {
  a: {
    nome: "Cliente Exemplo A – Reforma Apto 302",
    status: "Em Execução",
    regime: "Reembolso com Comprovante Fiscal",
  },
  b: {
    nome: "Cliente Exemplo B – Reforma de Banheiros",
    status: "Orçamento Elaborado",
    regime: "Empreitada Global (preço fechado)",
  },
};
