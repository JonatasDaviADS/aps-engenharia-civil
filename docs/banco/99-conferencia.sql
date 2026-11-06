-- Conferência: o RLS está ligado nas 5 tabelas? (só lê, não altera nada)
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- Conferência 2: quais usuários existem no login?
select id, email, created_at
from auth.users
order by created_at;