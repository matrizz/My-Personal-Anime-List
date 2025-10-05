"use client"

import type { Anime, ListType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Trash2, MoveRight } from "lucide-react"
import { motion } from "framer-motion"

interface AnimeCardProps {
  anime: Anime
  onAddToList?: (anime: Anime, listType: ListType) => void
  onRemove?: (animeId: number) => void
  onMove?: (animeId: number, toList: ListType) => void
  currentList?: ListType | null
  showActions?: boolean
}

const listLabels: Record<ListType, string> = {
  toWatch: "To Watch",
  watching: "Watching",
  watched: "Watched",
  doNotWatch: "Do not Watch",
}

export function AnimeCard({ anime, onAddToList, onRemove, onMove, currentList, showActions = true }: AnimeCardProps) {
  const title = anime.title_english || anime.title
  const synopsis = anime.synopsis
    ? anime.synopsis.length > 150
      ? anime.synopsis.substring(0, 150) + "..."
      : anime.synopsis
    : "No synopsis available."

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors group"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-muted">
        <img
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {anime.score && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-semibold">
            ⭐ {anime.score}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-balance">{title}</h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          {anime.year && <span>{anime.year}</span>}
          {anime.episodes && (
            <>
              <span>•</span>
              <span>{anime.episodes} eps</span>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{synopsis}</p>

        {showActions && (
          <div className="flex gap-2">
            {!currentList && onAddToList && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex-1" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to List
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {(Object.keys(listLabels) as ListType[]).map((listType) => (
                    <DropdownMenuItem key={listType} onClick={() => onAddToList(anime, listType)}>
                      {listLabels[listType]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {currentList && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <MoveRight className="w-4 h-4 mr-2" />
                      Move to
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {(Object.keys(listLabels) as ListType[])
                      .filter((listType) => listType !== currentList)
                      .map((listType) => (
                        <DropdownMenuItem key={listType} onClick={() => onMove?.(anime.mal_id, listType)}>
                          {listLabels[listType]}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove?.(anime.mal_id)}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
