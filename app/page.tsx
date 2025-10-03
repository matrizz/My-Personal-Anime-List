"use client"

import { useEffect, useState } from "react"
import type { ListType, ViewType } from "@/lib/types"
import { useAnimeLists } from "@/hooks/use-anime-lists"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { SearchSection } from "@/components/search-section"
import { ListView } from "@/components/list-view"
import { DiscoverySection } from "@/components/discovery-section"
import { RandomSection } from "@/components/random-section"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('' as any)
  const { animes, addAnime, removeAnime, moveAnime, isInAnyList, listsCounts } = useAnimeLists()

  useEffect(() => {
    const currentViewStorage = localStorage.getItem("currentView")
    if (currentViewStorage) {
      setCurrentView(currentViewStorage as ViewType)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView])

  async function waitBackend({ port, path }: { port: number | string, path: string }, retries = 20, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(`http://localhost:${port}${path}`);
        if (res.ok) return true;
      } catch (_) {
        // backend ainda não respondeu
      }
      await new Promise(r => setTimeout(r, delay));
    }
    throw new Error("Backend não respondeu a tempo");
  }

  useEffect(() => {
    waitBackend({ port: 4000, path: "/health" })
      .then(() => console.log("✅ Backend pronto!"))
      .catch(() => console.error("❌ Backend não subiu"))
  }, []);

  const isListView = (view: ViewType): view is ListType => {
    return ["TO_WATCH", "WATCHING", "WATCHED", "DO_NOT_WATCH"].includes(view)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} listCounts={listsCounts} />
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center gap-4">
          <MobileNav currentView={currentView} onViewChange={setCurrentView} listCounts={listsCounts} />
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
              animes={animes || []}
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
