"use client"

import { useState, useEffect } from "react"
import { type Anime, type ListType, Status } from "@/lib/types"
import getAnimeFromStorage, { addAnimeToList, removeAnimeFromList, moveAnimeBetweenLists } from "@/lib/storage"

export function useAnimeLists() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [listsCounts, setCounts] = useState({ TO_WATCH: 0, WATCHING: 0, WATCHED: 0, DO_NOT_WATCH: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnimeFromStorage()
      .then((result) => setAnimes(result.flat()))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {

    const newCounts = { TO_WATCH: 0, WATCHING: 0, WATCHED: 0, DO_NOT_WATCH: 0 }

    animes.forEach((anime) => {
      if (anime.status === "TO_WATCH") newCounts.TO_WATCH++
      else if (anime.status === "WATCHING") newCounts.WATCHING++
      else if (anime.status === "WATCHED") newCounts.WATCHED++
      else if (anime.status === "DO_NOT_WATCH") newCounts.DO_NOT_WATCH++
    })

    setCounts(newCounts)
  }, [animes])

  const addAnime = async (anime: Anime, listType: ListType) => {
    addAnimeToList(anime, listType)
    setAnimes(prev => [...prev.filter(a => a.mal_id !== anime.mal_id), { ...anime, status: listType }])
  }

  const removeAnime = async (animeId: number, listType: ListType) => {
    removeAnimeFromList(animeId, listType)
    setAnimes((prev) => prev.filter(a => a.mal_id !== animeId))
  }

  const moveAnime = async (animeId: number, fromList: ListType, toList: ListType) => {
    moveAnimeBetweenLists(animeId, fromList, toList)
    setAnimes(prev => prev.map(a => a.mal_id === animeId ? { ...a, status: toList } : a))
  }

  const isInList = async (animeId: number, listType: ListType): Promise<boolean> => {
    if (!animes) {
      return false
    }

    return !!animes.find((anime) => animeId === anime.mal_id && anime.status === listType)
  }

  const isInAnyList = (animeId: number): ListType | false => {
    if (!animes) {
      return false
    }

    if (animes.find((anime) => anime.mal_id === animeId)) return Status.TO_WATCH
    else if (animes.find((anime) => anime.mal_id === animeId)) return Status.WATCHING
    else if (animes.find((anime) => anime.mal_id === animeId)) return Status.WATCHED
    else if (animes.find((anime) => anime.mal_id === animeId)) return Status.DO_NOT_WATCH

    return false
  }

  return {
    animes,
    addAnime,
    listsCounts,
    loading,
    removeAnime,
    moveAnime,
    isInList,
    isInAnyList,
  }
}
