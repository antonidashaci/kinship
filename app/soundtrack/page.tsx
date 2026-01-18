import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SoundtrackClient } from "@/components/soundtrack/soundtrack-client"
import { MeshBackground } from "@/components/layout/mesh-background"

export default async function SoundtrackPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth/login")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*, families(*)")
        .eq("id", user.id)
        .single()

    if (!profile?.family_id) {
        redirect("/onboarding")
    }

    const { data: songs } = await supabase
        .from("family_playlist")
        .select("*, added_by_profile:profiles!added_by(full_name)")
        .eq("family_id", profile.family_id)
        .order("is_song_of_week", { ascending: false })
        .order("votes", { ascending: false })

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
                <main className="px-4 md:px-8 max-w-4xl mx-auto mt-6">
                    <SoundtrackClient
                        songs={songs || []}
                        currentUserId={user.id}
                        familyId={profile.family_id}
                    />
                </main>
            </div>
        </MeshBackground>
    )
}
