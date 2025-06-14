
-- Inserir o novo usuário administrador
INSERT INTO public.admin_users (email, name, role, status) 
VALUES ('Angelo@findme.com', 'Angelo', 'Administrador', 'active')
ON CONFLICT (email) DO UPDATE SET 
  name = 'Angelo',
  role = 'Administrador',
  status = 'active';
