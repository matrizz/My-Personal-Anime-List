"use client"

import { useState } from "react"
import type { ListType, ViewType } from "@/lib/types"
import { useAnimeLists } from "@/hooks/use-anime-lists"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { SearchSection } from "@/components/search-section"
import { ListView } from "@/components/list-view"
import { DiscoverySection } from "@/components/discovery-section"
import { RandomSection } from "@/components/random-section"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("discovery")
  const { lists, addAnime, removeAnime, moveAnime, isInAnyList } = useAnimeLists()

  const listCounts: Record<ListType, number> = {
    toWatch: lists.toWatch.length,
    watching: lists.watching.length,
    watched: lists.watched.length,
    doNotWatch: lists.doNotWatch.length,
  }

  const isListView = (view: ViewType): view is ListType => {
    return ["toWatch", "watching", "watched", "doNotWatch"].includes(view)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} listCounts={listCounts} />
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center gap-4">
          <MobileNav currentView={currentView} onViewChange={setCurrentView} listCounts={listCounts} />
          <div>
            <h1 className="text-xl font-bold">AnimeList</h1>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {currentView === "search" ? (
            <SearchSection onAddToList={addAnime} isInAnyList={isInAnyList} />
          ) : currentView === "discovery" ? (
            <DiscoverySection onAddToList={addAnime} isInAnyList={isInAnyList} />
          ) : currentView === "random" ? (
            <RandomSection onAddToList={addAnime} isInAnyList={isInAnyList} />
          ) : isListView(currentView) ? (
            <ListView
              animes={lists[currentView]}
              listType={currentView}
              onRemove={(animeId) => removeAnime(animeId, currentView)}
              onMove={(animeId, toList) => moveAnime(animeId, currentView, toList)}
            />
          ) : null}
        </div>
      </main>
    </div>
  )
}
