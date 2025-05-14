"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dumbbell, LayoutDashboard, Target, LineChart, Bot, User, Settings, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useMissions } from "@/hooks/use-missions"
import { Notifications } from "@/components/notifications"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [startMissionDialogOpen, setStartMissionDialogOpen] = useState(false)
  const { missions: availableMissions, loading: missionsLoading, acceptMission } = useMissions(false)
  const [acceptingMissionId, setAcceptingMissionId] = useState<string | null>(null)

  const isActive = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: "/missions", label: "Missions", icon: <Target className="h-4 w-4" /> },
    { path: "/progress", label: "Progress", icon: <LineChart className="h-4 w-4" /> },
    { path: "/ai-coach", label: "AI Coach", icon: <Bot className="h-4 w-4" /> },
    { path: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  ]

  const handleStartMission = () => {
    setStartMissionDialogOpen(true)
  }

  const handleAcceptMission = async (missionId: string) => {
    if (!user) return

    setAcceptingMissionId(missionId)
    try {
      await acceptMission(missionId)
      setStartMissionDialogOpen(false)
      // Navigate to missions page
      router.push("/missions")
    } finally {
      setAcceptingMissionId(null)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
              <Dumbbell className="h-5 w-5" />
              <span className="text-lg">Fitness Quest</span>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      isActive(link.path) ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Notifications />
                <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleStartMission}>
                  Start Mission
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold cursor-pointer dark:bg-blue-900 dark:text-blue-300">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleStartMission()
                  }}
                >
                  Start Mission
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Start Mission Dialog */}
      <Dialog open={startMissionDialogOpen} onOpenChange={setStartMissionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a New Mission</DialogTitle>
            <DialogDescription>Choose a mission to begin your fitness journey</DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-4">
              {missionsLoading ? (
                <p className="text-center py-4">Loading available missions...</p>
              ) : availableMissions.length === 0 ? (
                <p className="text-center py-4">No available missions at the moment.</p>
              ) : (
                availableMissions.map((mission) => (
                  <div key={mission._id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{mission.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          mission.difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : mission.difficulty === "medium"
                              ? "bg-blue-100 text-blue-800"
                              : mission.difficulty === "hard"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {mission.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{mission.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {mission.xp} XP • {mission.duration} days
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptMission(mission._id)}
                        disabled={acceptingMissionId === mission._id}
                      >
                        {acceptingMissionId === mission._id ? "Accepting..." : "Start"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStartMissionDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
