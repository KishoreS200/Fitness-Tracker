"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { AlertCircle, ArrowRight, Dumbbell, Info, Loader2, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

export default function LoginPage() {
  // State for login
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // State for registration
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")

  // Auth context
  const { login, register, loading, error } = useAuth()
  const router = useRouter()
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // If user is already logged in (from localStorage), redirect to home
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedEmail = localStorage.getItem("userEmail")
      console.log("Login page useEffect - stored email:", storedEmail)

      // Check both localStorage and cookies
      const hasCookie = document.cookie.split(";").some((item) => item.trim().startsWith("userEmail="))
      console.log("Login page useEffect - has cookie:", hasCookie)

      if (storedEmail && !loginAttempted) {
        console.log("Redirecting to home due to stored email")
        router.push("/")
      }
    }

    // Check login status after component mounts
    checkLoginStatus()
  }, [router, loginAttempted])

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    console.log("Login attempt with email:", email)
    setLoginAttempted(true)

    try {
      console.log("Calling login function...")
      await login(email, password)

      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        console.log("Login successful, redirecting...")
        router.push("/")
      }, 100)
    } catch (err) {
      console.error("Login error in page component:", err)
    }
  }

  // Handle registration form submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationError(null)

    // Validate inputs
    if (!registerEmail.trim() || !registerPassword.trim() || !name.trim()) {
      setRegistrationError("All fields are required")
      return
    }

    if (registerPassword !== confirmPassword) {
      setRegistrationError("Passwords do not match")
      return
    }

    if (registerPassword.length < 6) {
      setRegistrationError("Password must be at least 6 characters")
      return
    }

    try {
      const success = await register(registerEmail, registerPassword, name)
      if (success) {
        setRegistrationSuccess(true)
        // Clear form
        setRegisterEmail("")
        setRegisterPassword("")
        setConfirmPassword("")
        setName("")

        // Switch to login tab after successful registration
        setTimeout(() => {
          setActiveTab("login")
          setRegistrationSuccess(false)
        }, 3000)
      }
    } catch (err) {
      console.error("Registration error:", err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-600 text-white rounded-full mb-4 shadow-lg">
            <Dumbbell className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Fitness Quest</h1>
          <p className="text-gray-600 dark:text-gray-300">Turn your fitness journey into an exciting adventure</p>
        </div>

        <Card className="border-0 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="space-y-1 pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <CardHeader className="pt-0">
                <CardTitle className="text-xl">Sign in to your account</CardTitle>
                <CardDescription>Enter your email and password to sign in</CardDescription>
              </CardHeader>

              {error && (
                <CardContent className="pt-0 pb-0">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </CardContent>
              )}

              <form onSubmit={handleLoginSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={loading || !email.trim() || !password.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader className="pt-0">
                <CardTitle className="text-xl">Create an account</CardTitle>
                <CardDescription>Enter your details to create a new account</CardDescription>
              </CardHeader>

              {registrationError && (
                <CardContent className="pt-0 pb-0">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{registrationError}</AlertDescription>
                  </Alert>
                </CardContent>
              )}

              {registrationSuccess && (
                <CardContent className="pt-0 pb-0">
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <Info className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      Registration successful! You can now log in with your credentials.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}

              <form onSubmit={handleRegisterSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={
                      loading ||
                      !registerEmail.trim() ||
                      !registerPassword.trim() ||
                      !name.trim() ||
                      !confirmPassword.trim()
                    }
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <UserPlus className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>By signing in, you agree to our</p>
          <div className="mt-1 space-x-2">
            <Link href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
              Terms of Service
            </Link>
            <span>and</span>
            <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 Fitness Quest. All rights reserved.</p>
      </div>
    </div>
  )
}
