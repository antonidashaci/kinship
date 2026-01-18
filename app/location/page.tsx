import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LocationClient } from "@/components/location/location-client"
import { MeshBackground } from "@/components/layout/mesh-background"

export default async function LocationPage() {
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

    const { data: familyMembers } = await supabase
        .from("profiles")
        .select("*")
        .eq("family_id", profile.family_id)

    const { data: settings } = await supabase
        .from("location_settings")
        .select("*")
        .eq("user_id", user.id)
        .single()

    const { data: pings } = await supabase
        .from("location_pings")
        .select("*, user:profiles!user_id(full_name, avatar_url)")
        .eq("family_id", profile.family_id)
        .order("created_at", { ascending: false })
        .limit(20)

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
                    <LocationClient
                        pings={pings || []}
                        settings={settings || null}
                        familyMembers={familyMembers || []}
                        currentUserId={user.id}
                        familyId={profile.family_id}
                    />
                </main>
            </div>
        </MeshBackground>
    )
}
