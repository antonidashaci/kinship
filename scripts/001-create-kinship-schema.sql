-- Kinship Database Schema
-- Tables: families, profiles, domestic_roles, emotional_milestones, interactions

-- 1. Families table (must be created first as profiles references it)
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name TEXT NOT NULL,
  invite_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 0, 9),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  current_mood TEXT CHECK (current_mood IN ('happy', 'calm', 'tired', 'stressed', 'excited', 'sad', 'loved', 'neutral')),
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  is_family_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Domestic roles table
CREATE TABLE domestic_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  role_type TEXT NOT NULL CHECK (role_type IN ('Barista', 'Chef', 'Driver', 'Librarian', 'DJ', 'Gardener', 'Cleaner', 'Pet Carer')),
  is_active BOOLEAN DEFAULT TRUE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Emotional milestones table
CREATE TABLE emotional_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  milestone_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Interactions table (Digital Hugs, Gratitude Pings, Orders)
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('Digital Hug', 'Gratitude Ping', 'Barista Order', 'Chef Order', 'Driver Request', 'Librarian Request')),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_family ON profiles(family_id);
CREATE INDEX idx_domestic_roles_family ON domestic_roles(family_id);
CREATE INDEX idx_domestic_roles_user ON domestic_roles(user_id);
CREATE INDEX idx_interactions_receiver ON interactions(receiver_id);
CREATE INDEX idx_interactions_family ON interactions(family_id);
CREATE INDEX idx_emotional_milestones_family ON emotional_milestones(family_id);
