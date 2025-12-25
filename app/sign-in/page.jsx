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
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: email, 2: otp, 3: success
  const [resetEmail, setResetEmail] = useState("")
  const [resetOtp, setResetOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const completeLogin = async (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user))
    window.dispatchEvent(new Event("auth-change"))
    await new Promise((resolve) => setTimeout(resolve, 100))

    const isClubAdmin = user.role === "clubAdmin" || (user.role === "admin" && user.assignedClubId)

    if (isClubAdmin && user.assignedClubId) {
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
          body: JSON.stringify({
            email,
            password,
          }),
        })

        if (data?.user) {
          await completeLogin(data.user)
          return
        }

        if (data?.otpRequired) {
          setOtpRequested(true);
          setInfo(data.message || "OTP sent to your @bmsce.ac.in email.");
setOtp(data.otp || "")
          return
        }
      }

      if (!otp.trim()) {
        setError("Enter the OTP sent to your @bmsce.ac.in email.")
        return
      }

      const { user } = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          otp: otp.trim(),
        }),
      })

      await completeLogin(user)
    } catch (err) {
      console.error(err)
      setError(err.message || "An error occurred. Please try again.")

      if (err.message?.includes("Invalid or expired OTP")) {
        setOtp("")
        setInfo("OTP is invalid or expired. Please try again.")
      }

      if (err.message?.includes("Invalid credentials")) {
        setOtpRequested(false)
        setOtp("")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setInfo("")
    setLoading(true)

    try {
      const data = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (data?.otpRequired) {
        setOtpRequested(true)
        setOtp(data.otp || ""
        setInfo(data.message || "OTP sent to your @bmsce.ac.in email.")
        return
      }

      setInfo("OTP sent to your @bmsce.ac.in email.")
      setOtp("")
      setOtpRequested(true)
    } catch (err) {
      console.error(err)
      setError(err.message || "Unable to resend OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setLoading(true)

    try {
      if (forgotPasswordStep === 1) {
        // Send password reset OTP
        if (!resetEmail.endsWith("@bmsce.ac.in")) {
          setError("Email must be from @bmsce.ac.in domain")
          setLoading(false)
          return
        }
        const data = await apiRequest("/users/forgot-password", {
          method: "POST",
          body: JSON.stringify({
            email: resetEmail,
          }),
        })

        setInfo(data.message || "Password reset OTP sent to your email.")
        setForgotPasswordStep(2)
      } else if (forgotPasswordStep === 2) {
        // Verify OTP and reset password
        if (!resetOtp.trim()) {
          setError("Enter the OTP sent to your email.")
          setLoading(false)
          return
        }

        if (newPassword !== confirmPassword) {
          setError("Passwords do not match.")
          setLoading(false)
          return
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{6,}$/
        if (!passwordRegex.test(newPassword)) {
          setError("Password must contain at least one uppercase letter, one special character, and one number.")
          setLoading(false)
          return
        }

        const data = await apiRequest("/users/reset-password", {
          method: "POST",
          body: JSON.stringify({
            email: resetEmail,
            otp: resetOtp.trim(),
            newPassword,
          }),
        })

        setInfo(data.message || "Password reset successfully.")
        setForgotPasswordStep(3)
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotPasswordStep(1)
    setResetEmail("")
    setResetOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    setInfo("")
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
              <p className="text-xs text-muted-foreground">
                Only @bmsce.ac.in emails are allowed
              </p>
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

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setShowForgotPassword(true)}
                disabled={otpRequested}
              >
                Forgot password?
              </button>
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
                <p className="text-xs text-muted-foreground">
                  Check your @bmsce.ac.in inbox for the code.
                </p>
              </div>
            )}

            {error && (
              <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 p-3 rounded">
                {error}
              </div>
            )}

            {info && !error && (
              <div className="text-primary text-sm bg-primary/10 border border-primary/20 p-3 rounded">
                {info}
              </div>
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

            {otpRequested && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={handleResendOtp}
              >
                Resend OTP
              </Button>
            )}
          </form>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline font-medium">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                {forgotPasswordStep === 1 && "Enter your email to receive a password reset code"}
                {forgotPasswordStep === 2 && "Enter the reset code and your new password"}
                {forgotPasswordStep === 3 && "Password reset successful!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {forgotPasswordStep < 3 && (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  {forgotPasswordStep === 1 && (
                    <div className="space-y-3">
                      <label htmlFor="reset-email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email Address
                      </label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="your@bmsce.ac.in"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Only @bmsce.ac.in emails are allowed
                      </p>
                    </div>
                  )}

                  {forgotPasswordStep === 2 && (
                    <>
                      <div className="space-y-3">
                        <label htmlFor="reset-code" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Reset Code
                        </label>
                        <Input
                          id="reset-code"
                          type="text"
                          inputMode="numeric"
                          placeholder="6-digit code"
                          value={resetOtp}
                          onChange={(e) => setResetOtp(e.target.value)}
                          className="w-full"
                          maxLength={6}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Check your email for the reset code.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="new-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          New Password
                        </label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="confirm-password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full"
                          required
                        />
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  {info && !error && (
                    <div className="text-primary text-sm bg-primary/10 border border-primary/20 p-3 rounded-md">
                      {info}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="submit" 
                      className="flex-1" 
                      disabled={loading}
                    >
                      {loading ? "Processing..." : forgotPasswordStep === 1 ? "Send Reset Code" : "Reset Password"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForgotPassword}
                      disabled={loading}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {forgotPasswordStep === 3 && (
                <div className="space-y-4 text-center">
                  <div className="text-primary text-sm bg-primary/10 border border-primary/20 p-4 rounded-md">
                    {info}
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={resetForgotPassword}
                  >
                    Back to Sign In
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
