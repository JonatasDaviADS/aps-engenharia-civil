-- ======================================================
-- 02-regras-acesso.sql - Quem pode ver/fazer o quê (RLS)
-- Rodar no Supabase: SQL Editor > New query > Run
-- Regras: Engenheiro acessa tudo; Cliente só enxerga a SUA obra.
-- =======================================================

-- 1 - FUNÇÃO AUXILIAR: "quem está logado é engenheiro?"
-- security definer = consulta perfis sem ficar presa às próprias regras.
create or replace function public.eh_engenheiro()
returns boolean
language sql 
stable
security definer 
set search_path = public 
as $$
    select exists (
        select 1 from public.perfis
        where id = auth.uid() and papel = 'engenheiro'
    );
$$;

revoke all on function public.eh_engenheiro() from public, anon;
grant execute on function public.eh_engenheiro() to authenticated;

-- 2 - PERMISSÕES (GRANT): só quem está logado ("authenticated"). Visitante (anon) = nada.
grant usage on schema public to authenticated;
grant select, insert, update, delete
    on public.perfis, public.obras, public.diario, public.orcamentos, public.avisos
    to authenticated;

-- 3 - PERFIS: cada um vê o próprio; engenheiro vê e gerencia todos. 
create policy perfis_leitura on public.perfis
    for select to authenticated
    using (id = auth.uid() or public.eh_engenheiro());

create policy perfis_escrita_eng on public.perfis
    for all to authenticated
    using (public.eh_engenheiro()) with check (public.eh_engenheiro());

-- 4 - OBRAS: engenheiro vê todas; cliente só a obra em que ele é o cliente_id.
create policy obras_leitura on public.obras
    for select to authenticated
    using (public.eh_engenheiro() or cliente_id = auth.uid());

create policy obras_escrita_eng on public.obras
    for all to authenticated
    using (public.eh_engenheiro()) with check (public.eh_engenheiro());

-- 5 - DIARIO: cliente lê só o diário das SUAS obras; só o engenheiro grava.
create policy diario_leitura on public.diario
for select to authenticated
using (
    public.eh_engenheiro()
    or exists (select 1 from public.obras o where o.id = diario.obra_id and o.cliente_id = auth.uid())
);

create policy diario_escrita_eng on public.diario
    for all to authenticated
    using (public.eh_engenheiro()) with check (public.eh_engenheiro());

-- 6 - ORCAMENTOS: mesma lógica do diário. 
create policy orcamentos_leitura on public.orcamentos 
    for select to authenticated
    using (
        public.eh_engenheiro()
            or exists (select 1 from public.obras o where o.id = orcamentos.obra_id and o.cliente_id = auth.uid())    
    );

create policy orcamentos_escrita_eng on public.orcamentos
    for all to authenticated
    using (public.eh_engenheiro()) with check (public.eh_engenheiro());

-- 7 -AVISOS: ambos leem os da obra; só o engenheiro cria/apaga; o cliente da obra pode responder (update).
create policy avisos_leitura on public.avisos
    for select to authenticated
    using (
        public.eh_engenheiro()
        or exists (select 1 from public.obras o where o.id = avisos.obra_id and o.cliente_id = auth.uid())
    );

create policy avisos_criar_eng on public.avisos
    for insert to authenticated
    with check (public.eh_engenheiro());

create policy avisos_apagar_eng on public.avisos
    for delete to authenticated
    using (public.eh_engenheiro());

create policy avisos_atualizar on public.avisos
    for update to authenticated
    using (
        public.eh_engenheiro()
        or exists (select 1 from public.obras o
        where o.id = avisos.obra_id and o.cliente_id = auth.uid())
    )
    with check (
        public.eh_engenheiro()
        or exists (select 1 from public.obras o
        where o.id = avisos.obra_id and o.cliente_id = auth.uid())
    );