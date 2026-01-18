-- Kinship Feature Database Schema
-- Run this in Supabase SQL Editor

-- =============================================
-- GRATITUDE WALL
-- =============================================
CREATE TABLE IF NOT EXISTS gratitude_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for gratitude_notes
ALTER TABLE gratitude_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gratitude notes in their family"
  ON gratitude_notes FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create gratitude notes in their family"
  ON gratitude_notes FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own gratitude notes"
  ON gratitude_notes FOR DELETE
  USING (author_id = auth.uid());

-- =============================================
-- SHOPPING/FRIDGE LIST
-- =============================================
CREATE TABLE IF NOT EXISTS shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  category TEXT DEFAULT 'general',
  is_purchased BOOLEAN DEFAULT false,
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shopping items in their family"
  ON shopping_items FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage shopping items in their family"
  ON shopping_items FOR ALL
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- CARE PACKAGES
-- =============================================
CREATE TABLE IF NOT EXISTS care_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  fulfiller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  request_type TEXT CHECK (request_type IN ('hug', 'snack', 'call', 'gift', 'visit')) NOT NULL,
  message TEXT,
  is_fulfilled BOOLEAN DEFAULT false,
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE care_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view care packages in their family"
  ON care_packages FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create care packages in their family"
  ON care_packages FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update care packages in their family"
  ON care_packages FOR UPDATE
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- FAMILY CHALLENGES
-- =============================================
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🎯',
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  reward_badge TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  has_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view challenges in their family"
  ON challenges FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage challenges in their family"
  ON challenges FOR ALL
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view challenge participants"
  ON challenge_participants FOR SELECT
  USING (challenge_id IN (SELECT id FROM challenges WHERE family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage their participation"
  ON challenge_participants FOR ALL
  USING (user_id = auth.uid());

-- =============================================
-- FAMILY SOUNDTRACK
-- =============================================
CREATE TABLE IF NOT EXISTS family_playlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  song_title TEXT NOT NULL,
  artist TEXT,
  album_art_url TEXT,
  spotify_uri TEXT,
  youtube_url TEXT,
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  votes INTEGER DEFAULT 0,
  is_song_of_week BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE family_playlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view playlist in their family"
  ON family_playlist FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage playlist in their family"
  ON family_playlist FOR ALL
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

-- =============================================
-- FAMILY MEETINGS
-- =============================================
CREATE TABLE IF NOT EXISTS family_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meeting_agenda_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES family_meetings(id) ON DELETE CASCADE,
  item_text TEXT NOT NULL,
  proposed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  decision TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_resolved BOOLEAN DEFAULT false
);

ALTER TABLE family_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_agenda_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view meetings in their family"
  ON family_meetings FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage meetings in their family"
  ON family_meetings FOR ALL
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view agenda items"
  ON meeting_agenda_items FOR SELECT
  USING (meeting_id IN (SELECT id FROM family_meetings WHERE family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Users can manage agenda items"
  ON meeting_agenda_items FOR ALL
  USING (meeting_id IN (SELECT id FROM family_meetings WHERE family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())));

-- =============================================
-- TIME CAPSULES
-- =============================================
CREATE TABLE IF NOT EXISTS time_capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  unlock_date DATE NOT NULL,
  is_unlocked BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS time_capsule_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capsule_id UUID REFERENCES time_capsules(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content_type TEXT CHECK (content_type IN ('text', 'image', 'audio', 'video')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE time_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_capsule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view unlocked capsules or own capsules"
  ON time_capsules FOR SELECT
  USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
    AND (is_unlocked = true OR unlock_date <= CURRENT_DATE)
  );

CREATE POLICY "Users can create capsules in their family"
  ON time_capsules FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view capsule items when unlocked"
  ON time_capsule_items FOR SELECT
  USING (
    capsule_id IN (
      SELECT id FROM time_capsules 
      WHERE family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
      AND (is_unlocked = true OR unlock_date <= CURRENT_DATE)
    )
  );

CREATE POLICY "Users can add items to capsules"
  ON time_capsule_items FOR INSERT
  WITH CHECK (
    capsule_id IN (
      SELECT id FROM time_capsules 
      WHERE family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
      AND is_unlocked = false
    )
  );

-- =============================================
-- LOCATION SHARING (Opt-in)
-- =============================================
CREATE TABLE IF NOT EXISTS location_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  is_sharing_enabled BOOLEAN DEFAULT false,
  home_latitude DECIMAL,
  home_longitude DECIMAL,
  home_radius_meters INTEGER DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS location_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  ping_type TEXT CHECK (ping_type IN ('arrived_home', 'left_home', 'check_in')) NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE location_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_pings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own location settings"
  ON location_settings FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view location pings in their family"
  ON location_pings FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create their own pings"
  ON location_pings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- MOOD TRACKING EXTENSION (for Emotional Check-In Alerts)
-- =============================================
CREATE TABLE IF NOT EXISTS mood_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mood_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  alert_type TEXT CHECK (alert_type IN ('prolonged_negative', 'mood_change', 'check_in_request')) NOT NULL,
  triggered_by_mood TEXT,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mood history in their family"
  ON mood_history FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Users can record their own mood"
  ON mood_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view alerts in their family"
  ON mood_alerts FOR SELECT
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can acknowledge alerts"
  ON mood_alerts FOR UPDATE
  USING (family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid()));
