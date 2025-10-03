import type { Anime as AnimeModel } from './prisma'

export type ListType = "TO_WATCH" | "WATCHING" | "WATCHED" | "DO_NOT_WATCH"

export type ViewType = "search" | "discovery" | "random" | ListType

type Image = {
  image_url: string,
  small_image_url: string,
  large_image_url: string,
}

type AnimeImages = {
  jpg: Image
  webp: Image
}

type Anime = AnimeModel & {
  images: AnimeImages
}

export enum Status {
  TO_WATCH = 'TO_WATCH',
  WATCHING = 'WATCHING',
  WATCHED = 'WATCHED',
  DO_NOT_WATCH = 'DO_NOT_WATCH',
}

export type {
  Anime,
  Image
}