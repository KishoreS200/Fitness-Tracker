import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AICoach } from "@/components/ai-coach"

export default function AICoachPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">AI Fitness Coach</h1>
        <div className="grid grid-cols-1 gap-6">
          <AICoach />
        </div>
      </main>
      <Footer />
    </div>
  )
}
