
-- Criar função para verificar login de administrador
CREATE OR REPLACE FUNCTION verify_admin_login(input_email TEXT, input_password TEXT)
RETURNS TABLE (
  email VARCHAR,
  name VARCHAR,
  role VARCHAR,
  status VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.email,
    au.name,
    au.role,
    au.status
  FROM public.admin_users au
  WHERE au.email = input_email
    AND au.status = 'active'
    AND au.password_hash = crypt(input_password, au.password_hash);
END;
$$;
