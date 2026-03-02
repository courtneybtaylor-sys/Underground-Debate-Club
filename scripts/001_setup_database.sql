-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'SCHOOL', 'UNDERGROUND')),
  school_license_code TEXT,
  school_license_verified BOOLEAN DEFAULT FALSE,
  underground_age_verified BOOLEAN DEFAULT FALSE,
  subscription_waitlist_email TEXT,
  rhetoric_class TEXT DEFAULT 'analyst' CHECK (rhetoric_class IN ('analyst', 'firebrand', 'trickster', 'diplomat')),
  influence INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  debates INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  oracle_line TEXT,
  debates_for_oracle INTEGER DEFAULT 0,
  underground_unlocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create debates table
CREATE TABLE IF NOT EXISTS public.debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  rhetoric_class TEXT NOT NULL,
  opponent TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('WIN', 'LOSS', 'DRAW')),
  voters_won INTEGER NOT NULL,
  total_voters INTEGER NOT NULL DEFAULT 5,
  round_1_score JSONB DEFAULT '{"logic": 50, "rhetoric": 50, "fact": 50}',
  round_2_score JSONB DEFAULT '{"logic": 50, "rhetoric": 50, "fact": 50}',
  round_3_score JSONB DEFAULT '{"logic": 50, "rhetoric": 50, "fact": 50}',
  total_score JSONB DEFAULT '{"logic": 50, "rhetoric": 50, "fact": 50}',
  ai_arguments JSONB DEFAULT '[]',
  user_arguments JSONB DEFAULT '[]',
  debrief TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create school_licenses table
CREATE TABLE IF NOT EXISTS public.school_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  school_name TEXT NOT NULL,
  issued_to_email TEXT NOT NULL,
  activation_count INTEGER DEFAULT 0,
  max_activations INTEGER DEFAULT 100,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create oracle_conversations table
CREATE TABLE IF NOT EXISTS public.oracle_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'oracle' CHECK (mode IN ('oracle', 'underground')),
  messages JSONB DEFAULT '[]',
  depth INTEGER DEFAULT 0,
  oracle_line_generated TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oracle_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for debates table (users can see their own + public recent debates)
CREATE POLICY "debates_select_own" ON public.debates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "debates_select_recent_public" ON public.debates FOR SELECT USING (created_at > NOW() - INTERVAL '24 hours') WITH CHECK (TRUE);
CREATE POLICY "debates_insert_own" ON public.debates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "debates_update_own" ON public.debates FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for school_licenses (public read for validation, insert disabled)
CREATE POLICY "school_licenses_select" ON public.school_licenses FOR SELECT USING (TRUE);

-- RLS Policies for oracle_conversations
CREATE POLICY "oracle_conversations_select_own" ON public.oracle_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "oracle_conversations_insert_own" ON public.oracle_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "oracle_conversations_update_own" ON public.oracle_conversations FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Debater')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_debates_user_id ON public.debates(user_id);
CREATE INDEX idx_debates_created_at ON public.debates(created_at DESC);
CREATE INDEX idx_oracle_conversations_user_id ON public.oracle_conversations(user_id);
CREATE INDEX idx_school_licenses_code ON public.school_licenses(code);
