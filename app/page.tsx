"use client"

import { useRef } from "react"
import { Navbar } from "@/components/navbar"
import { UserProfile } from "@/components/user-profile"
import { StatsCards } from "@/components/stats-cards"
import { ActiveMissions } from "@/components/active-missions"
import { AvailableMissions } from "@/components/available-missions"
import { AICoach } from "@/components/ai-coach"
import { WorkoutRecommendations } from "@/components/workout-recommendations"
import { StepTracker } from "@/components/step-tracker"
import { Footer } from "@/components/footer"

export default function Dashboard() {
  // Create a ref for the top of the page
  const topRef = useRef<HTMLDivElement>(null)

  // Prevent auto-scrolling when the dashboard loads
  // We're not using useEffect to scroll to top anymore
  // This prevents the unwanted auto-scrolling behavior

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Reference div at the top of the page */}
      <div ref={topRef}></div>
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <UserProfile />
        <StatsCards />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <ActiveMissions />
          </div>
          <div>
            <StepTracker />
          </div>
        </div>

        <AvailableMissions />
        <AICoach />
        <WorkoutRecommendations />
      </main>
      <Footer />
    </div>
  )
}
