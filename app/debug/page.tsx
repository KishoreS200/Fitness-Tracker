"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DebugPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [cookieInfo, setCookieInfo] = useState<string>("Loading...")
  const [localStorageInfo, setLocalStorageInfo] = useState<string>("Loading...")

  useEffect(() => {
    // Get cookie info
    setCookieInfo(document.cookie || "No cookies found")

    // Get localStorage info
    const userEmail = localStorage.getItem("userEmail")
    const authProvider = localStorage.getItem("authProvider")
    setLocalStorageInfo(`userEmail: ${userEmail || "Not found"}, authProvider: ${authProvider || "Not found"}`)
  }, [])

  const handleClearAll = () => {
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    // Clear localStorage
    localStorage.clear()

    // Refresh the page
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User State</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {user ? JSON.stringify(user, null, 2) : "Not logged in"}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">{cookieInfo}</pre>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Local Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">{localStorageInfo}</pre>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
        <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
        <Button onClick={handleClearAll} variant="destructive">
          Clear All Auth Data
        </Button>
      </div>
    </div>
  )
}
