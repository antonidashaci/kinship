import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RolesClient } from "@/components/roles/roles-client"

export default async function RolesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile with family info
  const { data: profile } = await supabase.from("profiles").select("*, families(*)").eq("id", user.id).single()

  if (!profile?.family_id) {
    redirect("/onboarding")
  }

  // Fetch all roles for the family today
  const today = new Date().toISOString().split("T")[0]
  const { data: todayRoles } = await supabase
    .from("domestic_roles")
    .select("*, profiles(full_name, avatar_url)")
    .eq("family_id", profile.family_id)
    .eq("assigned_date", today)
    .eq("is_active", true)

  // Fetch user's active role (may not exist yet)
  const { data: myRole } = await supabase
    .from("domestic_roles")
    .select("*")
    .eq("user_id", user.id)
    .eq("assigned_date", today)
    .eq("is_active", true)
    .maybeSingle()

  // Fetch family members
  const { data: familyMembers } = await supabase.from("profiles").select("*").eq("family_id", profile.family_id)

  return (
    <RolesClient
      currentUser={profile}
      family={profile.families}
      todayRoles={todayRoles || []}
      myRole={myRole}
      familyMembers={familyMembers || []}
    />
  )
}
