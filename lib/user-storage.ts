export interface UserProfile {
  name: string
  avatarUrl: string
}

const USER_PROFILE_KEY = "user-profile"

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return {
      name: "",
      avatarUrl: "",
    }
  }

  const stored = localStorage.getItem(USER_PROFILE_KEY)
  if (!stored) {
    return {
      name: "",
      avatarUrl: "",
    }
  }

  try {
    return JSON.parse(stored)
  } catch {
    return {
      name: "",
      avatarUrl: "",
    }
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile))
}
