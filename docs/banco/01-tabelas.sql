-- =============================================================================================================
-- 01 - Tabela.sql - Banco do APS Engenharia Civil
-- =============================================================================================================

-- 1 - PERFIS: Papel de cada usúario. O "id" é o mesmo do login (auth.users). 
create table public.perfis(
  id uuid primary key references auth.users(id) on delete cascade,
  papel text not null check (papel in ('engenheiro', 'cliente')),
  nome text not null,
  criado_em timestamptz not null default now()
);

-- 2 - OBRAS: código único e cliente dono.
create table public.obras (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome text not null, local text, status text not null default 'Orçamento em elaboração',
  regime text, 
  cliente_id uuid references public.perfis(id), 
  criado_em timestamptz not null default now()
);

-- 3 - DIARIO: apontamentos de campo.
create table public.diario(
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade, data date not null default current_date, 
  texto text not null, 
  foto_url text,
  criado_em timestamptz not null default now()
);

-- 4 - ORCAMENTOS: tópicos do modelo em word. 
create table public.orcamentos(
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  numero text, data date,
  validade_dias int, 
  contratante text,
  local_servico text,
  objeto text,
  responsavel text,
  crea text,
  diretrizes text,
  escopo jsonb not null default '[]'::jsonb,
  valor numeric(12,2),
  pct_entrada int default 40,
  pct_intermediaria int default 30,
  gatilho_entrada text,
  gatilho_intermediaria text,
  gatilho_saldo text,
  prazo text,
  garantia text,
  observacoes text,
  criado_em timestamptz not null default now()

);

-- 5 - AVISOS: canal engenheiro-clientes, 3 estados.
create table public.avisos(
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references public.obras(id) on delete cascade,
  texto text not null, status text not null default 'nao_lida' check (status in ('nao_lida', 'lida', 'respondida')),
  resposta text,
  criado_em timestamptz not null default now()
);

-- 6 - SEGURANÇA: liga o RLS em todas (sem políticas = ninguém acessa).
alter table public.perfis enable row level security;
alter table public.obras enable row level security;
alter table public.diario enable row level security;
alter table public.orcamentos enable row level security;
alter table public.avisos enable row level security;