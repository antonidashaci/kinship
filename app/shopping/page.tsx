import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ShoppingListClient } from "@/components/shopping/shopping-list-client"
import { MeshBackground } from "@/components/layout/mesh-background"

export default async function ShoppingPage() {
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

    const { data: items } = await supabase
        .from("shopping_items")
        .select("*, added_by_profile:profiles!added_by(full_name)")
        .eq("family_id", profile.family_id)
        .order("is_purchased")
        .order("created_at", { ascending: false })

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
                    <ShoppingListClient
                        items={items || []}
                        currentUserId={user.id}
                        familyId={profile.family_id}
                    />
                </main>
            </div>
        </MeshBackground>
    )
}
