export type MoodType = "happy" | "calm" | "tired" | "stressed" | "excited" | "sad" | "loved" | "neutral"

export type RoleType = "Barista" | "Chef" | "Driver" | "Librarian" | "DJ" | "Gardener" | "Cleaner" | "Pet Carer"

export type InteractionType =
  | "Digital Hug"
  | "Gratitude Ping"
  | "Barista Order"
  | "Chef Order"
  | "Driver Request"
  | "Librarian Request"

export interface Family {
  id: string
  family_name: string
  invite_code: string
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  current_mood: MoodType | null
  family_id: string | null
  is_family_admin: boolean
  created_at: string
  updated_at: string
}

export interface DomesticRole {
  id: string
  user_id: string
  family_id: string
  role_type: RoleType
  is_active: boolean
  assigned_date: string
  created_at: string
  updated_at: string
}

export interface EmotionalMilestone {
  id: string
  family_id: string
  created_by: string
  title: string
  description: string | null
  image_url: string | null
  milestone_date: string
  created_at: string
}

export interface Interaction {
  id: string
  sender_id: string
  receiver_id: string
  family_id: string
  interaction_type: InteractionType
  message: string | null
  is_read: boolean
  created_at: string
}

// =============================================
// NEW FEATURE TYPES
// =============================================

// Gratitude Wall
export interface GratitudeNote {
  id: string
  family_id: string
  author_id: string | null
  recipient_id: string | null
  message: string
  created_at: string
  author?: { full_name: string | null; avatar_url: string | null }
  recipient?: { full_name: string | null; avatar_url: string | null }
}

// Shopping/Fridge List
export type ShoppingCategory = 'groceries' | 'household' | 'personal' | 'general'

export interface ShoppingItem {
  id: string
  family_id: string
  item_name: string
  quantity: number
  category: ShoppingCategory
  is_purchased: boolean
  added_by: string | null
  created_at: string
  added_by_profile?: { full_name: string | null }
}

// Care Packages
export type CarePackageType = 'hug' | 'snack' | 'call' | 'gift' | 'visit'

export interface CarePackage {
  id: string
  family_id: string
  requester_id: string | null
  fulfiller_id: string | null
  request_type: CarePackageType
  message: string | null
  is_fulfilled: boolean
  fulfilled_at: string | null
  created_at: string
  requester?: { full_name: string | null; avatar_url: string | null }
  fulfiller?: { full_name: string | null; avatar_url: string | null }
}

// Family Challenges
export interface Challenge {
  id: string
  family_id: string
  title: string
  description: string | null
  icon: string
  start_date: string
  end_date: string | null
  reward_badge: string | null
  is_completed: boolean
  created_by: string | null
  created_at: string
  participants?: ChallengeParticipant[]
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  has_completed: boolean
  completed_at: string | null
  user?: { full_name: string | null; avatar_url: string | null }
}

// Family Soundtrack
export interface PlaylistSong {
  id: string
  family_id: string
  song_title: string
  artist: string | null
  album_art_url: string | null
  spotify_uri: string | null
  youtube_url: string | null
  added_by: string | null
  votes: number
  is_song_of_week: boolean
  created_at: string
  added_by_profile?: { full_name: string | null }
}

// Family Meetings
export interface FamilyMeeting {
  id: string
  family_id: string
  title: string
  scheduled_for: string | null
  is_active: boolean
  notes: string | null
  created_by: string | null
  created_at: string
  agenda_items?: MeetingAgendaItem[]
}

export interface MeetingAgendaItem {
  id: string
  meeting_id: string
  item_text: string
  proposed_by: string | null
  votes_for: number
  votes_against: number
  decision: string | null
  assigned_to: string | null
  is_resolved: boolean
  proposed_by_profile?: { full_name: string | null }
  assigned_to_profile?: { full_name: string | null }
}

// Time Capsules
export interface TimeCapsule {
  id: string
  family_id: string
  title: string
  description: string | null
  unlock_date: string
  is_unlocked: boolean
  created_by: string | null
  created_at: string
  items?: TimeCapsuleItem[]
}

export type TimeCapsuleContentType = 'text' | 'image' | 'audio' | 'video'

export interface TimeCapsuleItem {
  id: string
  capsule_id: string
  contributor_id: string | null
  content_type: TimeCapsuleContentType
  content: string
  created_at: string
  contributor?: { full_name: string | null; avatar_url: string | null }
}

// Location Sharing
export interface LocationSettings {
  id: string
  user_id: string
  is_sharing_enabled: boolean
  home_latitude: number | null
  home_longitude: number | null
  home_radius_meters: number
  updated_at: string
}

export type LocationPingType = 'arrived_home' | 'left_home' | 'check_in'

export interface LocationPing {
  id: string
  user_id: string
  family_id: string
  ping_type: LocationPingType
  message: string | null
  created_at: string
  user?: { full_name: string | null; avatar_url: string | null }
}

// Mood Tracking / Emotional Check-In
export interface MoodHistory {
  id: string
  user_id: string
  mood: MoodType
  recorded_at: string
}

export type MoodAlertType = 'prolonged_negative' | 'mood_change' | 'check_in_request'

export interface MoodAlert {
  id: string
  user_id: string
  family_id: string
  alert_type: MoodAlertType
  triggered_by_mood: MoodType | null
  is_acknowledged: boolean
  acknowledged_by: string | null
  created_at: string
  user?: { full_name: string | null; avatar_url: string | null }
}
