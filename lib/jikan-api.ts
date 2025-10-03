import type { Anime } from "./types"

const JIKAN_API_BASE = "https://api.jikan.moe/v4"

export async function searchAnime(
  query: string,
  page = 1,
): Promise<{
  data: Anime[]
  pagination: {
    has_next_page: boolean
    current_page: number
    last_visible_page: number
  }
}> {
  const response = await fetch(`${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=12`)

  if (!response.ok) {
    throw new Error("Failed to fetch anime")
  }

  return response.json()
}

export async function getPopularAnime(page = 1): Promise<{
  data: Anime[]
  pagination: {
    has_next_page: boolean
    current_page: number
    last_visible_page: number
  }
}> {
  const response = await fetch(`${JIKAN_API_BASE}/top/anime?page=${page}&limit=12`)

  if (!response.ok) {
    throw new Error("Failed to fetch popular anime")
  }

  return response.json()
}

export async function getAnimeById(id: number): Promise<{ data: Anime }> {
  const response = await fetch(`${JIKAN_API_BASE}/anime/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch anime")
  }

  return response.json()
}

export async function getRandomAnime(): Promise<{ data: Anime }> {
  const response = await fetch(`${JIKAN_API_BASE}/random/anime`)

  if (!response.ok) {
    throw new Error("Failed to fetch random anime")
  }

  return response.json()
}
