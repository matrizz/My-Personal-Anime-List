export interface Anime {
  mal_id: number
  title: string
  title_english?: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  synopsis?: string
  year?: number
  score?: number
  episodes?: number
  status?: string
}

export type ListType = "toWatch" | "watching" | "watched" | "doNotWatch"

export type ViewType = "search" | "discovery" | "random" | ListType

export interface AnimeList {
  toWatch: Anime[]
  watching: Anime[]
  watched: Anime[]
  doNotWatch: Anime[]
}
