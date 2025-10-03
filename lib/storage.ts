import type { Anime, ListType } from "./types"


export default async function getAnimesFromStorage(): Promise<Anime[][]> {

  const TO_WATCH: Anime[] = []
  const WATCHING: Anime[] = []
  const WATCHED: Anime[] = []
  const DO_NOT_WATCH: Anime[] = []

  try {

    let lists = (await (await fetch('http://localhost:4000/animes', { method: 'GET' })).json())


    lists.forEach((list: Anime) => {
      if (list.status ===  'TO_WATCH') TO_WATCH.push(list)
      if (list.status === 'WATCHING') WATCHING.push(list)
      if (list.status === 'WATCHED') WATCHED.push(list)
      if (list.status === 'DO_NOT_WATCH') DO_NOT_WATCH.push(list)
    })

    return [
      TO_WATCH,
      WATCHING,
      WATCHED,
      DO_NOT_WATCH
    ]

  } catch (err) {
    console.error(err)

    return [
      TO_WATCH,
      WATCHING,
      WATCHED,
      DO_NOT_WATCH
    ]
  }
}


export async function addAnimeToList(anime: Anime, listType: ListType) {
  try {
    await fetch('http://localhost:4000/animes', { method: 'POST', body: JSON.stringify({ listType, anime }) })
  } catch (err) {
    console.error(err)
  }
}

export async function removeAnimeFromList(animeId: number, listType: ListType): Promise<void> {

  try {
    await fetch('http://localhost:4000/animes', { method: 'DELETE', body: JSON.stringify({ listType, animeId }) })
  } catch (err) {
    console.error(err)
  }
}

export async function getAnimeById(animeId: number): Promise<Anime | undefined> {
  try {
    const anime = await (await fetch(`http://localhost:4000/animes/${animeId}`, { method: 'GET' })).json()
    return anime as Anime | undefined
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export async function getUser() {
  return await (await fetch('http://localhost:4000/user', { method: 'GET' })).json()
}

export async function moveAnimeBetweenLists(animeId: number, fromList: ListType, toList: ListType): Promise<void> {
  try {
    await fetch('http://localhost:4000/animes', { method: 'PUT', body: JSON.stringify({ fromList, toList, animeId }) })
  } catch (err) {
    console.error(err)
  }
}
