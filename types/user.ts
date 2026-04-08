export type UserProfile = {
  id: string
  email: string
  created_at: string
  role?: "user" | "admin"
}

export type GuestSession = {
  isGuest: true
}

export type AuthState = UserProfile | GuestSession | null
