"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getPopularAnime } from "@/lib/jikan-api"
import type { Anime, ListType } from "@/lib/types"
import { AnimeCard } from "./anime-card"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface DiscoverySectionProps {
  onAddToList: (anime: Anime, listType: ListType) => void
  isInAnyList: (animeId: number) => ListType | false
}

export function DiscoverySection({ onAddToList, isInAnyList }: DiscoverySectionProps) {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    loadPopularAnime(1)
  }, [])

  const loadPopularAnime = async (page: number) => {
    setLoading(true)
    try {
      const result = await getPopularAnime(page)
      setAnimes(result.data)
      animes.push(...result.data)
      setCurrentPage(page)
      setHasNextPage(result.pagination.has_next_page)
    } catch (error) {
      console.error("Error loading popular anime:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadPopularAnime(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      loadPopularAnime(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Descoberta</h1>
        <p className="text-muted-foreground">Animes populares no momento</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {animes && animes.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} onAddToList={onAddToList} isInAnyList={isInAnyList} />
            ))}
          </motion.div>

          {animes && animes.length > 0 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">Página {currentPage}</span>
              <Button variant="outline" onClick={handleNextPage} disabled={!hasNextPage || loading}>
                Próxima
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
