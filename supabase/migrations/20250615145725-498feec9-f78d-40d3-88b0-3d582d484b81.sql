
-- Primeiro, vamos adicionar os índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_status_created_at ON public.events(status, created_at);

-- Vamos primeiro verificar se existe algum usuário na tabela users
-- Se não existir, vamos criar um usuário de teste
INSERT INTO public.users (
  id,
  email,
  name,
  user_type
) VALUES (
  gen_random_uuid(),
  'admin@teste.com',
  'Admin Teste',
  'organizer'
) ON CONFLICT (email) DO NOTHING;

-- Agora vamos inserir eventos usando um creator_id que existe
-- Primeiro, vamos buscar um ID de usuário existente ou usar o que acabamos de criar
WITH existing_user AS (
  SELECT id FROM public.users LIMIT 1
)
INSERT INTO public.events (
  title, 
  description, 
  date, 
  time, 
  location, 
  category, 
  capacity, 
  price, 
  creator_id, 
  creator_name, 
  status,
  image
)
SELECT 
  'Evento de Teste', 
  'Este é um evento de teste para verificar se a consulta está funcionando', 
  '2024-07-01', 
  '19:00', 
  'Local de Teste', 
  'Tecnologia', 
  100, 
  0, 
  existing_user.id,
  'Admin Teste', 
  'approved',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop'
FROM existing_user
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Evento de Teste');

-- Inserir mais eventos de exemplo
WITH existing_user AS (
  SELECT id FROM public.users LIMIT 1
)
INSERT INTO public.events (
  title, 
  description, 
  date, 
  time, 
  location, 
  category, 
  capacity, 
  price, 
  creator_id, 
  creator_name, 
  status,
  image
)
SELECT 
  'Workshop de React', 
  'Workshop prático sobre desenvolvimento com React', 
  '2024-07-15', 
  '14:00', 
  'Centro de Convenções', 
  'Tecnologia', 
  50, 
  25, 
  existing_user.id,
  'Tech Team', 
  'approved',
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=2070&auto=format&fit=crop'
FROM existing_user
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Workshop de React');

-- Garantir que a tabela events tem as permissões corretas para leitura pública
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.events TO authenticated;
