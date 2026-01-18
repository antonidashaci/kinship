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
