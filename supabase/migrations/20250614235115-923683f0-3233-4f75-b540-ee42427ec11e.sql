
-- Create function to update admin password and data
CREATE OR REPLACE FUNCTION update_admin_password(
  admin_id UUID,
  new_password TEXT,
  update_data JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update basic data
  UPDATE public.admin_users 
  SET 
    name = COALESCE(update_data->>'name', name),
    email = COALESCE(update_data->>'email', email),
    role = COALESCE(update_data->>'role', role),
    updated_at = now()
  WHERE id = admin_id;
  
  -- Update password if provided
  IF new_password IS NOT NULL AND new_password != '' THEN
    UPDATE public.admin_users 
    SET password_hash = crypt(new_password, gen_salt('bf'))
    WHERE id = admin_id;
  END IF;
END;
$$;

-- Create function to create new admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_name TEXT,
  admin_role TEXT,
  admin_password TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_users (email, name, role, password_hash)
  VALUES (
    admin_email,
    admin_name,
    admin_role,
    crypt(admin_password, gen_salt('bf'))
  );
END;
$$;
