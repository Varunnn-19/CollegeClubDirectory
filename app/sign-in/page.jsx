"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiRequest } from "@/lib/api-client"
import { Input } from "@/components/ui/input"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Email domain validation
    if (!email.endsWith("@bmsce.ac.in")) {
      setError("Email must be from @bmsce.ac.in domain")
      setLoading(false)
      return
    }

    try {
      const { user } = await apiRequest("/users/login", {
        method: "POST",
        body: { email, password },
      })

      localStorage.setItem("currentUser", JSON.stringify(user))
      
      // Dispatch event and wait a bit to ensure state updates
      window.dispatchEvent(new Event("auth-change"))
      
      // Small delay to ensure header state updates before navigation
      await new Promise(resolve => setTimeout(resolve, 100))

      if (user.role === "admin" && user.assignedClubId) {
        router.push(`/club-admin/${user.assignedClubId}`)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your college club account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="your@bmsce.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Only @bmsce.ac.in emails are allowed</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 p-3 rounded">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline font-medium">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
