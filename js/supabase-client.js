// ===============================================================
// supabase-client.js
// Conecta o site ao Supabase. Usa SÓ a chave PÚBLICA.
// ===============================================================

// Endereço do seu projeto (SEM /rest/v1/ no final)
const SUPABASE_URL = "https://mrcyjwlfbntksxnzvgny.supabase.co";

// Chave pública: pode ficar no site, porque o RLS protege os dados
const SUPABASE_CHAVE_PUBLICA = "sb_publishable_CW5T_uTqAR3tVFC4VPp8FQ_7_WNtcf9";

// window.supabase vem da biblioteca (carregada no index.html).
// createClient monta o "cliente": o objeto que conversa com o banco.
const clienteSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_CHAVE_PUBLICA,
);
