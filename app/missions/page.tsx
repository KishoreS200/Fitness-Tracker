import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ActiveMissions } from "@/components/active-missions"
import { AvailableMissions } from "@/components/available-missions"

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Your Missions</h1>
        <ActiveMissions />
        <AvailableMissions />
      </main>
      <Footer />
    </div>
  )
}
