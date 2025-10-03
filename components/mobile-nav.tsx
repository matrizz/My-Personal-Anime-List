"use client"

import type { ListType, ViewType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Eye, CheckCircle2, XCircle, Clock, Compass, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface MobileNavProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  listCounts: Record<ListType, number>
}

const navItems = [
  { id: "search" as const, label: "Search", icon: Search },
  { id: "discovery" as const, label: "Descoberta", icon: Compass },
  { id: "random" as const, label: "Random", icon: Shuffle },
  { id: "TO_WATCH" as const, label: "To Watch", icon: Clock },
  { id: "WATCHING" as const, label: "Watching", icon: Eye },
  { id: "WATCHED" as const, label: "Watched", icon: CheckCircle2 },
  { id: "DO_NOT_WATCH" as const, label: "Do not Watch", icon: XCircle },
]

export function MobileNav({ currentView, onViewChange, listCounts }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleViewChange = (view: ViewType) => {
    onViewChange(view)
    localStorage.setItem("currentView", view)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-6 border-b border-border text-left">
          <SheetTitle className="text-2xl font-bold">AnimeList</SheetTitle>
          <p className="text-sm text-muted-foreground mt-1">Your personal anime tracker</p>
        </SheetHeader>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            const count =
              item.id !== "search" && item.id !== "discovery" && item.id !== "random"
                ? listCounts[item.id as ListType]
                : undefined

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => handleViewChange(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive ? "bg-primary-foreground/20" : "bg-muted",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">Powered by Jikan API</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
