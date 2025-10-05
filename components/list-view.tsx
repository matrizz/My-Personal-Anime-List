"use client"

import type { Anime, ListType } from "@/lib/types"
import { AnimeCard } from "./anime-card"
import { motion, AnimatePresence } from "framer-motion"

interface ListViewProps {
  animes: Anime[]
  listType: ListType
  onRemove: (animeId: number) => void
  onMove: (animeId: number, toList: ListType) => void
}

const listInfo: Record<ListType, { title: string; description: string; emoji: string }> = {
  toWatch: {
    title: "To Watch",
    description: "Anime you plan to watch in the future",
    emoji: "📋",
  },
  watching: {
    title: "Watching",
    description: "Anime you are currently watching",
    emoji: "▶️",
  },
  watched: {
    title: "Watched",
    description: "Anime you have completed",
    emoji: "✅",
  },
  doNotWatch: {
    title: "Do not Watch",
    description: "Anime you decided not to watch",
    emoji: "🚫",
  },
}

export function ListView({ animes, listType, onRemove, onMove }: ListViewProps) {
  const info = listInfo[listType]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <span>{info.emoji}</span>
          {info.title}
        </h1>
        <p className="text-xl text-muted-foreground">{info.description}</p>
      </div>

      {animes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground text-lg mb-2">No anime in this list yet</p>
          <p className="text-sm text-muted-foreground">Search for anime and add them to get started</p>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground">
            {animes.length} {animes.length === 1 ? "anime" : "animes"}
          </p>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {animes.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  currentList={listType}
                  onRemove={onRemove}
                  onMove={onMove}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  )
}
