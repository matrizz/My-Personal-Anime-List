import prisma from "./prisma"

export interface UserProfile {
  name: string
  avatarUrl: string
}

export async function getUserProfile(): Promise<UserProfile> {

  const profile = (await fetch('http://localhost:4000/user', { method: 'GET' }))

  try {
    return profile as any as UserProfile
  } catch (err){
    console.error(err)
    return {
      name: "",
      avatarUrl: ""
    }
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await fetch('http://localhost:4000/user', { method: 'PUT', body: JSON.stringify({ username: profile.name, avatar: profile.avatarUrl }) })
}
