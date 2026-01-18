import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GratitudeWallClient } from "@/components/gratitude/gratitude-wall-client"
import { MeshBackground } from "@/components/layout/mesh-background"

export default async function GratitudePage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    // Fetch profile with family info
    const { data: profile } = await supabase
        .from("profiles")
        .select("*, families(*)")
        .eq("id", user.id)
        .single()

    if (!profile?.family_id) {
        redirect("/onboarding")
    }

    // Fetch family members
    const { data: familyMembers } = await supabase
        .from("profiles")
        .select("*")
        .eq("family_id", profile.family_id)
        .order("full_name")

    // Fetch gratitude notes
    const { data: notes } = await supabase
        .from("gratitude_notes")
        .select("*, author:profiles!author_id(full_name, avatar_url), recipient:profiles!recipient_id(full_name, avatar_url)")
        .eq("family_id", profile.family_id)
        .order("created_at", { ascending: false })
        .limit(50)

    return (
        <MeshBackground decorations="home">
            <div className="min-h-screen pb-24">
                <header className="sticky top-0 z-50 glass-panel-solid">
                    <div className="px-4 md:px-8 py-4 max-w-7xl mx-auto">
                        <a href="/home" className="text-sm text-muted-foreground hover:text-foreground">
                            ← Back to Home
                        </a>
                    </div>
                </header>
                <main className="px-4 md:px-8 max-w-7xl mx-auto mt-6">
                    <GratitudeWallClient
                        notes={notes || []}
                        familyMembers={familyMembers || []}
                        currentUserId={user.id}
                        familyId={profile.family_id}
                    />
                </main>
            </div>
        </MeshBackground>
    )
}
