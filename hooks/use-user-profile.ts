"use client"

import { useState, useEffect } from "react"
import { getUserProfile, saveUserProfile, type UserProfile } from "@/lib/user-storage"

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>({ name: "", avatarUrl: "" })

  useEffect(() => {
    getUserProfile().then((res) => setProfile(res))    
  }, [])

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile)
    saveUserProfile(newProfile)
  }

  return { profile, updateProfile }
}
