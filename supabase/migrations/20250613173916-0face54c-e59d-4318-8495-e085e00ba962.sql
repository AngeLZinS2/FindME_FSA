
-- Create users table for authentication
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL DEFAULT 'attendee',
  phone VARCHAR(20),
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  capacity INTEGER NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  image TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  creator_name VARCHAR(255) NOT NULL,
  social_media JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event attendees table
CREATE TABLE public.event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can insert users" ON public.users
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for events
CREATE POLICY "Anyone can view approved events" ON public.events
  FOR SELECT USING (status = 'approved' OR status = 'active');

CREATE POLICY "Event creators can view their own events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Event creators can insert events" ON public.events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Event creators can update their own events" ON public.events
  FOR UPDATE USING (true);

-- Create RLS policies for event attendees
CREATE POLICY "Users can view event attendees" ON public.event_attendees
  FOR SELECT USING (true);

CREATE POLICY "Users can join events" ON public.event_attendees
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can leave events" ON public.event_attendees
  FOR DELETE USING (true);

-- Create RLS policies for admin users (restrict access)
CREATE POLICY "Only admins can view admin users" ON public.admin_users
  FOR ALL USING (false);

-- Insert default admin user
INSERT INTO public.admin_users (email, name, role, status) 
VALUES ('admin@findme.com', 'Administrador Principal', 'Administrador Geral', 'active');
