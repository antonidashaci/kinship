"use client"

import { MeshBackground } from "@/components/layout/mesh-background"
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid"
import { MoodHeatmap } from "@/components/home/mood-heatmap"
import { FamilyMemberCard } from "@/components/home/family-member-card"
import { ActiveRolesCard } from "@/components/home/active-roles-card"
import { RecentActivityCard } from "@/components/home/recent-activity-card"
import { QuickActionsCard } from "@/components/home/quick-actions-card"
import { InviteCard } from "@/components/home/invite-card"
import { HomeHeader } from "@/components/home/home-header"
import { FamilyFeatureGrid } from "@/components/home/family-feature-grid"
import { DigitalHugButton } from "@/components/hug/digital-hug-button"
import { ReceivedHugNotification } from "@/components/hug/received-hug-notification"
import type { Profile, Family, DomesticRole, Interaction } from "@/lib/types"

interface FamilyHubClientProps {
  currentUser: Profile
  family: Family
  familyMembers: Profile[]
  activeRoles: (DomesticRole & { profiles: { full_name: string | null; avatar_url: string | null } })[]
  recentInteractions: (Interaction & {
    sender: { full_name: string | null; avatar_url: string | null }
    receiver: { full_name: string | null; avatar_url: string | null }
  })[]
}

export function FamilyHubClient({
  currentUser,
  family,
  familyMembers,
  activeRoles,
  recentInteractions,
}: FamilyHubClientProps) {
  return (
    <MeshBackground decorations="home">
      <div className="min-h-screen pb-24">
        {/* Header */}
        <HomeHeader currentUser={currentUser} familyName={family.family_name} />

        {/* Main content */}
        <main className="px-4 md:px-8 max-w-7xl mx-auto">
          <BentoGrid>
            {/* Mood Heatmap - spans 2 columns */}
            <BentoItem span="2" delay={0.1}>
              <MoodHeatmap familyMembers={familyMembers} />
            </BentoItem>

            {/* Quick Actions */}
            <BentoItem delay={0.2}>
              <QuickActionsCard currentUserId={currentUser.id} familyMembers={familyMembers} />
            </BentoItem>

            {/* Family Members */}
            <BentoItem delay={0.3}>
              <FamilyMemberCard familyMembers={familyMembers} currentUserId={currentUser.id} />
            </BentoItem>

            {/* Family Apps - NEW */}
            <BentoItem span="2" delay={0.35}>
              <FamilyFeatureGrid />
            </BentoItem>

            {/* Active Roles Today */}
            <BentoItem delay={0.4}>
              <ActiveRolesCard activeRoles={activeRoles} />
            </BentoItem>

            {/* Invite Family */}
            <BentoItem delay={0.5}>
              <InviteCard inviteCode={family.invite_code} familyName={family.family_name} />
            </BentoItem>

            {/* Recent Activity - spans full row */}
            <BentoItem span="row" delay={0.6}>
              <RecentActivityCard interactions={recentInteractions} />
            </BentoItem>
          </BentoGrid>
        </main>

        <DigitalHugButton currentUserId={currentUser.id} familyId={family.id} familyMembers={familyMembers} />
        <ReceivedHugNotification currentUserId={currentUser.id} />
      </div>
    </MeshBackground>
  )
}
