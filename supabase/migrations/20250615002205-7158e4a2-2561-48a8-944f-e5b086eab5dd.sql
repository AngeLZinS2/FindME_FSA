
-- Verificar se existem eventos na tabela
SELECT COUNT(*) as total_events FROM public.events;

-- Verificar eventos por status
SELECT status, COUNT(*) as count FROM public.events GROUP BY status;

-- Verificar alguns eventos específicos para análise
SELECT id, title, status, date, time, category, creator_name, created_at 
FROM public.events 
ORDER BY created_at DESC 
LIMIT 5;

-- Verificar se há eventos aprovados especificamente
SELECT id, title, status, date, time, location, category 
FROM public.events 
WHERE status = 'approved'
ORDER BY date ASC;

-- Verificar a estrutura da tabela events
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'events' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar políticas RLS ativas na tabela events
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'events';
