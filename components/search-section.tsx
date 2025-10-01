"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { searchAnime } from "@/lib/jikan-api"
import type { Anime, ListType } from "@/lib/types"
import { AnimeCard } from "./anime-card"
import { motion, AnimatePresence } from "framer-motion"

interface SearchSectionProps {
  onAddToList: (anime: Anime, listType: ListType) => void
  isInAnyList: (animeId: number) => ListType | null
}

export function SearchSection({ onAddToList, isInAnyList }: SearchSectionProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Anime[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalPages, setTotalPages] = useState(0)

  const handleSearch = async (page = 1) => {
    if (!query.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await searchAnime(query, page)
      setResults(response.data)
      setCurrentPage(response.pagination.current_page)
      setHasNextPage(response.pagination.has_next_page)
      setTotalPages(response.pagination.last_visible_page)
    } catch (err) {
      setError("Failed to search anime. Please try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    handleSearch(1)
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      handleSearch(nextPage)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1
      setCurrentPage(prevPage)
      handleSearch(prevPage)
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 text-balance">Discover your next favorite anime</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Search thousands of anime and organize them into your personal lists.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search anime by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading || !query.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Searching
              </>
            ) : (
              "Search"
            )}
          </Button>
        </form>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Found {results.length} results {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!hasNextPage || loading}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {results.map((anime) => {
                const inList = isInAnyList(anime.mal_id)
                return (
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    onAddToList={onAddToList}
                    currentList={inList}
                    showActions={!inList}
                  />
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No results found. Try a different search term.</p>
        </div>
      )}
    </div>
  )
}
