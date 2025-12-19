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
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpRequested, setOtpRequested] = useState(false)

  const completeLogin = async (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user))
    window.dispatchEvent(new Event("auth-change"))
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (user.role === "admin" && user.assignedClubId) {
      router.push(`/club-admin/${user.assignedClubId}`)
    } else {
      router.push("/")
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setLoading(true)

    if (!email.endsWith("@bmsce.ac.in")) {
      setError("Email must be from @bmsce.ac.in domain")
      setLoading(false)
      return
    }

    try {
      if (!otpRequested) {
        const data = await apiRequest("/users/login", {
          method: "POST",
          body: { email, password },
        })
        if (data?.user) {
          await completeLogin(data.user)
          return
        }
        if (data?.otpRequired) {
          setOtpRequested(true)
          setInfo(data.message || "OTP sent to your @bmsce.ac.in email.")
          return
        }
      }

      if (!otp.trim()) {
        setError("Enter the OTP sent to your @bmsce.ac.in email.")
        return
      }

      const { user } = await apiRequest("/users/login", {
        method: "POST",
        body: { email, password, otp: otp.trim() },
      })
      await completeLogin(user)
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
      // Only reset otpRequested if it was a critical error, but for invalid OTP stay on current screen
      if (err.message?.includes("Invalid credentials")) {
         setOtpRequested(false)
         setOtp("")
      }
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
                disabled={otpRequested}
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
                disabled={otpRequested}
                required
              />
            </div>

            {otpRequested && (
              <div className="space-y-2">
                <label className="text-sm font-medium">One-Time Password</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Check your @bmsce.ac.in inbox for the code.</p>
              </div>
            )}

            {error && <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 p-3 rounded">{error}</div>}
            {info && !error && (
              <div className="text-primary text-sm bg-primary/10 border border-primary/20 p-3 rounded">{info}</div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : otpRequested ? "Verify OTP" : "Send OTP"}
            </Button>

            {otpRequested && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={loading}
                onClick={() => {
                  setOtp("")
                  setOtpRequested(false)
                  setInfo("")
                }}
              >
                Use a different account
              </Button>
            )}
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
