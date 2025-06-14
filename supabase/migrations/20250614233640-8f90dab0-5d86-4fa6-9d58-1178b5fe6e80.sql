
-- Adicionar coluna de senha à tabela admin_users
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Inserir os usuários administradores com senhas hash (usando crypt do PostgreSQL)
UPDATE public.admin_users 
SET password_hash = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@findme.com';

UPDATE public.admin_users 
SET password_hash = crypt('13281520', gen_salt('bf'))
WHERE email = 'Angelo@findme.com';

-- Se os usuários não existirem, inserir com senhas
INSERT INTO public.admin_users (email, name, role, status, password_hash) 
VALUES 
  ('admin@findme.com', 'Administrador Principal', 'Administrador Geral', 'active', crypt('admin123', gen_salt('bf'))),
  ('Angelo@findme.com', 'Angelo', 'Administrador', 'active', crypt('13281520', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  password_hash = EXCLUDED.password_hash;

-- Habilitar a extensão pgcrypto se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;
