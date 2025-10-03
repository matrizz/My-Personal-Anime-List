"use client"

import type { Anime, ListType } from "@/lib/types"
import { AnimeCard } from "./anime-card"
import { motion, AnimatePresence } from "framer-motion"
import { useAnimeLists } from "@/hooks/use-anime-lists"
import { Loader2 } from "lucide-react"

interface ListViewProps {
  animes: Anime[]
  listType: ListType
  onRemove: (animeId: number) => void
  onMove: (animeId: number, toList: ListType) => void
}

const listInfo: Record<ListType, { title: string; description: string; emoji: string }> = {
  TO_WATCH: {
    title: "To Watch",
    description: "Anime you plan to watch in the future",
    emoji: "📋",
  },
  WATCHING: {
    title: "Watching",
    description: "Anime you are currently watching",
    emoji: "▶️",
  },
  WATCHED: {
    title: "Watched",
    description: "Anime you have completed",
    emoji: "✅",
  },
  DO_NOT_WATCH: {
    title: "Do not Watch",
    description: "Anime you decided not to watch",
    emoji: "🚫",
  },
}

export function ListView({ animes, listType, onRemove, onMove }: ListViewProps) {
  const info = listInfo[listType]
  const currentAnimes = animes.filter((anime) => anime.status === listType)
  const { loading } = useAnimeLists()

  return (
    <div className="space-y-6">
      {
        loading ?
          (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )
          : (
            <>
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <span>{info.emoji}</span>
                  {info.title}
                </h1>
                <p className="text-xl text-muted-foreground">{info.description}</p>
              </div>

              {currentAnimes.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground text-lg mb-2">No anime in this list yet</p>
                  <p className="text-sm text-muted-foreground">Search for anime and add them to get started</p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    {currentAnimes.length} {currentAnimes.length === 1 ? "anime" : "animes"}
                  </p>

                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                      {currentAnimes.map((anime) => (
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
            </>
          )
      }
    </div>
  )
}
