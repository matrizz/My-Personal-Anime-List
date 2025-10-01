"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getRandomAnime } from "@/lib/jikan-api"
import type { Anime, ListType } from "@/lib/types"
import { Button } from "./ui/button"
import { Shuffle, Loader2, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RandomSectionProps {
  onAddToList: (anime: Anime, listType: ListType) => void
  isInAnyList: (animeId: number) => ListType | null
}

const listLabels: Record<ListType, string> = {
  toWatch: "To Watch",
  watching: "Watching",
  watched: "Watched",
  doNotWatch: "Do not Watch",
}

export function RandomSection({ onAddToList, isInAnyList }: RandomSectionProps) {
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(false)

  const loadRandomAnime = async () => {
    setLoading(true)
    try {
      const result = await getRandomAnime()
      setAnime(result.data)
    } catch (error) {
      console.error("Error loading random anime:", error)
    } finally {
      setLoading(false)
    }
  }

  const existingList = anime ? isInAnyList(anime.mal_id) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Random</h1>
        <p className="text-muted-foreground">Descubra um anime aleatório para assistir</p>
      </div>

      <div className="flex justify-center">
        <Button onClick={loadRandomAnime} disabled={loading} size="lg" className="gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shuffle className="w-5 h-5" />}
          {loading ? "Carregando..." : "Anime Aleatório"}
        </Button>
      </div>

      {anime && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
              <div className="relative aspect-[2/3] md:aspect-auto">
                <img
                  src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{anime.title}</h2>
                  {anime.title_english && anime.title_english !== anime.title && (
                    <p className="text-lg text-muted-foreground">{anime.title_english}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  {anime.year && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Ano:</span>
                      <span className="font-medium">{anime.year}</span>
                    </div>
                  )}
                  {anime.score && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Nota:</span>
                      <span className="font-medium text-primary">{anime.score.toFixed(1)}</span>
                    </div>
                  )}
                  {anime.episodes && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Episódios:</span>
                      <span className="font-medium">{anime.episodes}</span>
                    </div>
                  )}
                  {anime.status && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{anime.status}</span>
                    </div>
                  )}
                </div>

                {anime.synopsis && (
                  <div>
                    <h3 className="font-semibold mb-2">Sinopse</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{anime.synopsis}</p>
                  </div>
                )}

                <div className="pt-4">
                  {existingList ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-md text-sm">
                      <span>Já está em:</span>
                      <span className="font-medium">{listLabels[existingList]}</span>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="lg" className="gap-2">
                          <Plus className="w-5 h-5" />
                          Adicionar à Lista
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {(Object.keys(listLabels) as ListType[]).map((listType) => (
                          <DropdownMenuItem key={listType} onClick={() => onAddToList(anime, listType)}>
                            {listLabels[listType]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
