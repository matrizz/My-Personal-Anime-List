"use client"

import { useState, useEffect } from "react"
import type { AnimeList, Anime, ListType } from "@/lib/types"
import { getAnimeListsFromStorage, addAnimeToList, removeAnimeFromList, moveAnimeBetweenLists } from "@/lib/storage"

export function useAnimeLists() {
  const [lists, setLists] = useState<AnimeList>({
    toWatch: [],
    watching: [],
    watched: [],
    doNotWatch: [],
  })

  useEffect(() => {
    setLists(getAnimeListsFromStorage())
  }, [])

  const addAnime = (anime: Anime, listType: ListType) => {
    addAnimeToList(anime, listType)
    setLists(getAnimeListsFromStorage())
  }

  const removeAnime = (animeId: number, listType: ListType) => {
    removeAnimeFromList(animeId, listType)
    setLists(getAnimeListsFromStorage())
  }

  const moveAnime = (animeId: number, fromList: ListType, toList: ListType) => {
    moveAnimeBetweenLists(animeId, fromList, toList)
    setLists(getAnimeListsFromStorage())
  }

  const isInList = (animeId: number, listType: ListType): boolean => {
    return lists[listType].some((a) => a.mal_id === animeId)
  }

  const isInAnyList = (animeId: number): ListType | null => {
    for (const [key, value] of Object.entries(lists)) {
      if (value.some((a: Anime) => a.mal_id === animeId)) {
        return key as ListType
      }
    }
    return null
  }

  return {
    lists,
    addAnime,
    removeAnime,
    moveAnime,
    isInList,
    isInAnyList,
  }
}
