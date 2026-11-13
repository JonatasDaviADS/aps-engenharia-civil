-- ======================================================
-- 04-codigo-obra.sql
-- Gera o código da obra automaticamente: APS-AAAA-NNN
-- Exemplo: APS-2026-003
-- Executando no Supabase (SQL Editor)
-- ======================================================

-- 1) Sequência = contador que o banco incrementa sozinho. 
--      Começa em 3 porque as obras 001 e 002 já existiam (dados de teste). 
create sequence if not exists public.obra_numero_seq start 3;

-- 2) Permissão: quem está logado (authenticated) pode usar o contador. 
--      Sem isso, o INSERT falha com "permission denied for sequence".  
grant usage on sequence public.obra_numero_seq to authenticated; 

-- 3) Valor padrão da coluna "código":
--      'APS-' + ano atual + '-' + número com 3 dígitos (zeros à esquerda).
alter table public.obras
    alter column codigo set default 
    'APS-' || extract(year from now()):: text, 3 '0';

-- Observação: sequências não "voltam atrás". Se um INSERT falhar,
-- o número é pulado. Para reiniciar: select setval('public.obra_numero_seq', N, false);