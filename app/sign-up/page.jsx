"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { apiRequest } from "@/lib/api-client"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    usn: "",
    yearOfStudy: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [otp, setOtp] = useState("")
  const [devOtp, setDevOtp] = useState("")
  const [otpRequested, setOtpRequested] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setLoading(true)

    if (!otpRequested) {
      const missing = []
      if (!formData.name) missing.push("Name")
      if (!formData.email) missing.push("Email")
      if (!formData.usn) missing.push("USN")
      if (!formData.yearOfStudy) missing.push("Year of Study")
      if (!formData.phoneNumber) missing.push("Phone Number")
      if (!formData.password) missing.push("Password")

      if (missing.length > 0) {
        setError(`Missing required fields: ${missing.join(", ")}`)
        setLoading(false)
        return
      }


      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      if (!formData.email.endsWith("@bmsce.ac.in")) {
        setError("Email must be from @bmsce.ac.in domain")
        setLoading(false)
        return
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{6,}$/
      if (!passwordRegex.test(formData.password)) {
        setError("Password must contain at least one uppercase letter, one special character, and one number")
        setLoading(false)
        return
      }
    } else {
      if (!otp.trim()) {
        setError("Please enter the OTP sent to your email")
        setLoading(false)
        return
      }
    }

    try {
      const payload = {
        ...formData,
        otp: otpRequested ? otp.trim() : undefined,
      }
      const data = await apiRequest("/users/register", {
        method: "POST",
        body: payload,
      })

      if (data?.otpRequired) {
        setOtpRequested(true)
        setInfo(data.message || "OTP sent to your college email.")
        if (data?.otp) {
          setOtp(data.otp)
          setDevOtp(data.otp)
        }
        setLoading(false)
        return
      }

      const { user } = data
      localStorage.setItem("currentUser", JSON.stringify(user))
      window.dispatchEvent(new Event("auth-change"))
      
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push("/")
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
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join the college club directory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-3">
            {!otpRequested ? (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="john@bmsce.ac.in"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Only @bmsce.ac.in emails are allowed</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">USN (University Serial Number)</label>
                  <Input
                    type="text"
                    name="usn"
                    placeholder="Enter your USN (any value)"
                    value={formData.usn}
                    onChange={handleChange}
                    required
                    pattern=".*"
                    title="USN is required"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    required
                  >
                    <option value="">Select year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="9876543210"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2 py-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">One-Time Password</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  {devOtp ? (
                    <div className="text-xs text-primary bg-primary/10 border border-primary/20 p-2 rounded">
                      DEV OTP: {devOtp}
                    </div>
                  ) : null}
                  <p className="text-xs text-muted-foreground">Check your @bmsce.ac.in inbox for the code.</p>
                </div>
              </div>
            )}

            {error && <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 p-3 rounded">{error}</div>}
            {info && !error && <div className="text-primary text-sm bg-primary/10 border border-primary/20 p-3 rounded">{info}</div>}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : otpRequested ? "Verify OTP & Sign Up" : "Send OTP"}
            </Button>
            
            {otpRequested && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setOtpRequested(false)}
                disabled={loading}
              >
                Back to registration
              </Button>
            )}
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
