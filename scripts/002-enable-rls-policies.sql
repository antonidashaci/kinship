-- Enable Row Level Security on all tables
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE domestic_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- FAMILIES POLICIES
-- Users can view families they belong to
CREATE POLICY "Users can view their family" ON families
  FOR SELECT USING (
    id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

-- Users can create a new family
CREATE POLICY "Users can create families" ON families
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Family admins can update their family
CREATE POLICY "Family admins can update their family" ON families
  FOR UPDATE USING (
    id IN (SELECT family_id FROM profiles WHERE id = auth.uid() AND is_family_admin = TRUE)
  );

-- PROFILES POLICIES
-- Users can view profiles of family members
CREATE POLICY "Users can view family member profiles" ON profiles
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
    OR id = auth.uid()
  );

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- DOMESTIC ROLES POLICIES
-- Family members can view roles in their family
CREATE POLICY "Family members can view roles" ON domestic_roles
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

-- Users can assign roles to themselves
CREATE POLICY "Users can assign their own roles" ON domestic_roles
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

-- Users can update their own roles
CREATE POLICY "Users can update their own roles" ON domestic_roles
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own roles
CREATE POLICY "Users can delete their own roles" ON domestic_roles
  FOR DELETE USING (user_id = auth.uid());

-- EMOTIONAL MILESTONES POLICIES
-- Family members can view milestones
CREATE POLICY "Family members can view milestones" ON emotional_milestones
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

-- Family members can create milestones
CREATE POLICY "Family members can create milestones" ON emotional_milestones
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

-- Creators can update their milestones
CREATE POLICY "Creators can update milestones" ON emotional_milestones
  FOR UPDATE USING (created_by = auth.uid());

-- Creators can delete their milestones
CREATE POLICY "Creators can delete milestones" ON emotional_milestones
  FOR DELETE USING (created_by = auth.uid());

-- INTERACTIONS POLICIES
-- Users can view interactions they sent or received
CREATE POLICY "Users can view their interactions" ON interactions
  FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

-- Users can send interactions to family members
CREATE POLICY "Users can send interactions" ON interactions
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    family_id IN (SELECT family_id FROM profiles WHERE id = auth.uid())
  );

-- Receivers can update interactions (mark as read)
CREATE POLICY "Receivers can update interactions" ON interactions
  FOR UPDATE USING (receiver_id = auth.uid());
