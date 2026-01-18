import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FamilyHubClient } from "@/components/home/family-hub-client"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile with family info
  const { data: profile } = await supabase.from("profiles").select("*, families(*)").eq("id", user.id).single()

  // If user has no family, redirect to onboarding
  if (!profile?.family_id) {
    redirect("/onboarding")
  }

  // Fetch family members
  const { data: familyMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("family_id", profile.family_id)
    .order("created_at", { ascending: true })

  // Fetch active roles for today
  const today = new Date().toISOString().split("T")[0]
  const { data: activeRoles } = await supabase
    .from("domestic_roles")
    .select("*, profiles(full_name, avatar_url)")
    .eq("family_id", profile.family_id)
    .eq("assigned_date", today)
    .eq("is_active", true)

  // Fetch recent interactions
  const { data: recentInteractions } = await supabase
    .from("interactions")
    .select("*, sender:profiles!sender_id(full_name, avatar_url), receiver:profiles!receiver_id(full_name, avatar_url)")
    .eq("family_id", profile.family_id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <FamilyHubClient
      currentUser={profile}
      family={profile.families}
      familyMembers={familyMembers || []}
      activeRoles={activeRoles || []}
      recentInteractions={recentInteractions || []}
    />
  )
}
