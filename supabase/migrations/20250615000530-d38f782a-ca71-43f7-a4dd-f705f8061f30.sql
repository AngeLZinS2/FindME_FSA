
-- Verificar se a tabela admin_users tem RLS habilitado e remover se necessário
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Remover qualquer política RLS existente que possa estar bloqueando
DROP POLICY IF EXISTS "admin_users_policy" ON public.admin_users;

-- Garantir que a tabela é acessível para usuários autenticados
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO anon;
