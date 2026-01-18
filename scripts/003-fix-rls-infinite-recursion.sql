-- Fix infinite recursion in RLS policies
-- The issue: profiles SELECT policy queries profiles table, causing recursion

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view family member profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their family" ON families;
DROP POLICY IF EXISTS "Family admins can update their family" ON families;
DROP POLICY IF EXISTS "Family members can view roles" ON domestic_roles;
DROP POLICY IF EXISTS "Users can assign their own roles" ON domestic_roles;
DROP POLICY IF EXISTS "Family members can view milestones" ON emotional_milestones;
DROP POLICY IF EXISTS "Family members can create milestones" ON emotional_milestones;
DROP POLICY IF EXISTS "Users can send interactions" ON interactions;

-- Create a security definer function to get user's family_id without RLS
CREATE OR REPLACE FUNCTION get_user_family_id(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT family_id FROM profiles WHERE id = user_uuid;
$$;

-- Create a function to check if user is family admin
CREATE OR REPLACE FUNCTION is_family_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(is_family_admin, FALSE) FROM profiles WHERE id = user_uuid;
$$;

-- PROFILES POLICIES (fixed)
-- Users can always view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can view family members (uses security definer function)
CREATE POLICY "Users can view family member profiles" ON profiles
  FOR SELECT USING (
    family_id IS NOT NULL 
    AND family_id = get_user_family_id(auth.uid())
  );

-- FAMILIES POLICIES (fixed)
CREATE POLICY "Users can view their family" ON families
  FOR SELECT USING (
    id = get_user_family_id(auth.uid())
  );

CREATE POLICY "Family admins can update their family" ON families
  FOR UPDATE USING (
    id = get_user_family_id(auth.uid()) 
    AND is_family_admin(auth.uid()) = TRUE
  );

-- DOMESTIC ROLES POLICIES (fixed)
CREATE POLICY "Family members can view roles" ON domestic_roles
  FOR SELECT USING (
    family_id = get_user_family_id(auth.uid())
  );

CREATE POLICY "Users can assign their own roles" ON domestic_roles
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND family_id = get_user_family_id(auth.uid())
  );

-- EMOTIONAL MILESTONES POLICIES (fixed)
CREATE POLICY "Family members can view milestones" ON emotional_milestones
  FOR SELECT USING (
    family_id = get_user_family_id(auth.uid())
  );

CREATE POLICY "Family members can create milestones" ON emotional_milestones
  FOR INSERT WITH CHECK (
    created_by = auth.uid() 
    AND family_id = get_user_family_id(auth.uid())
  );

-- INTERACTIONS POLICIES (fixed)
CREATE POLICY "Users can send interactions" ON interactions
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() 
    AND family_id = get_user_family_id(auth.uid())
  );
