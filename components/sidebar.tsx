"use client"

import { useState } from "react"
import type { ListType, ViewType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, CheckCircle2, XCircle, Clock, Compass, Shuffle, Sun, Moon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { useUserProfile } from "@/hooks/use-user-profile"
import { SettingsModal } from "@/components/settings-modal"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  listCounts: Record<ListType, number>
}

const navItems = [
  { id: "search" as const, label: "Search", icon: Search },
  { id: "discovery" as const, label: "Descoberta", icon: Compass },
  { id: "random" as const, label: "Random", icon: Shuffle },
  { id: "toWatch" as const, label: "To Watch", icon: Clock },
  { id: "watching" as const, label: "Watching", icon: Eye },
  { id: "watched" as const, label: "Watched", icon: CheckCircle2 },
  { id: "doNotWatch" as const, label: "Do not Watch", icon: XCircle },
]

export function Sidebar({ currentView, onViewChange, listCounts }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const { profile, updateProfile } = useUserProfile()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">AnimeList</h2>
          <p className="text-sm text-muted-foreground mt-1">Your personal anime tracker</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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
                onClick={() => onViewChange(item.id)}
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

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="flex-1 justify-start p-2 h-auto" onClick={() => setSettingsOpen(true)}>
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} alt={profile.name || "User"} />
                <AvatarFallback className="bg-primary/10">
                  {profile.name ? profile.name[0].toUpperCase() : <User className="w-5 h-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left ml-3">
                <p className="text-sm font-medium">{profile.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground">Configurações</p>
              </div>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="shrink-0 bg-transparent"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">Powered by Jikan API</p>
        </div>
      </aside>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} profile={profile} onSave={updateProfile} />
    </>
  )
}
