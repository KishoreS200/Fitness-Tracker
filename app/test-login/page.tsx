"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TestLoginPage() {
  const [email, setEmail] = useState("")
  const { login, user, loading, error } = useAuth()
  const [loginStatus, setLoginStatus] = useState("")

  const handleLogin = async () => {
    try {
      setLoginStatus("Attempting login...")
      await login(email)
      setLoginStatus("Login successful!")
    } catch (err) {
      setLoginStatus(`Login failed: ${err}`)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login Test Page</h1>

      <div className="mb-4">
        <p className="mb-2">
          <strong>Current User:</strong> {user ? user.email : "Not logged in"}
        </p>
        <p className="mb-2">
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </p>
        <p className="mb-2">
          <strong>Error:</strong> {error || "None"}
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {loginStatus}
        </p>
      </div>

      <div className="space-y-4">
        <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Test Login"}
        </Button>

        <div className="pt-4 border-t mt-4">
          <h2 className="text-lg font-bold mb-2">Debug Info:</h2>
          <p className="text-sm">
            <strong>localStorage userEmail:</strong>{" "}
            {typeof window !== "undefined" ? localStorage.getItem("userEmail") : "N/A"}
          </p>
          <p className="text-sm">
            <strong>localStorage authProvider:</strong>{" "}
            {typeof window !== "undefined" ? localStorage.getItem("authProvider") : "N/A"}
          </p>
          <p className="text-sm">
            <strong>Cookie:</strong> {typeof document !== "undefined" ? document.cookie : "N/A"}
          </p>
          <p className="text-sm">
            <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
          </p>
        </div>
      </div>
    </div>
  )
}
