import type { AnimeList, Anime, ListType } from "./types"

const STORAGE_KEY = "anime-lists"

export function getAnimeListsFromStorage(): AnimeList {
  if (typeof window === "undefined") {
    return {
      toWatch: [],
      watching: [],
      watched: [],
      doNotWatch: [],
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return {
      toWatch: [],
      watching: [],
      watched: [],
      doNotWatch: [],
    }
  }

  try {
    return JSON.parse(stored)
  } catch {
    return {
      toWatch: [],
      watching: [],
      watched: [],
      doNotWatch: [],
    }
  }
}

export function saveAnimeListsToStorage(lists: AnimeList): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

export function addAnimeToList(anime: Anime, listType: ListType): void {
  const lists = getAnimeListsFromStorage()

  // Remove from all other lists first
  Object.keys(lists).forEach((key) => {
    lists[key as ListType] = lists[key as ListType].filter((a) => a.mal_id !== anime.mal_id)
  })

  // Add to the specified list
  lists[listType].push(anime)
  saveAnimeListsToStorage(lists)
}

export function removeAnimeFromList(animeId: number, listType: ListType): void {
  const lists = getAnimeListsFromStorage()
  lists[listType] = lists[listType].filter((a) => a.mal_id !== animeId)
  saveAnimeListsToStorage(lists)
}

export function moveAnimeBetweenLists(animeId: number, fromList: ListType, toList: ListType): void {
  const lists = getAnimeListsFromStorage()
  const anime = lists[fromList].find((a) => a.mal_id === animeId)

  if (anime) {
    lists[fromList] = lists[fromList].filter((a) => a.mal_id !== animeId)
    lists[toList].push(anime)
    saveAnimeListsToStorage(lists)
  }
}
