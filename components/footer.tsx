import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
              <Dumbbell className="h-5 w-5" />
              <span className="text-lg">Fitness Quest</span>
            </Link>
            <p className="text-sm text-gray-500 ml-4">Turn your fitness journey into an exciting adventure.</p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center md:text-right text-sm text-gray-500">
          © 2025 Fitness Quest. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
