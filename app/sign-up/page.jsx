"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getClubs } from "@/lib/data-utils"
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
    role: "user",
    assignedClubId: "",
  })
  const [otp, setOtp] = useState("")
  const [otpRequested, setOtpRequested] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [clubOptions, setClubOptions] = useState([])

  useEffect(() => {
    getClubs().then(setClubOptions).catch(console.error)
  }, [])

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
      if (
        !formData.name ||
        !formData.email ||
        !formData.usn ||
        !formData.yearOfStudy ||
        !formData.phoneNumber ||
        !formData.password
      ) {
        setError("All fields are required")
        setLoading(false)
        return
      }

      if (formData.role === "admin" && !formData.assignedClubId) {
        setError("Please select a club to manage")
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
    } else if (!otp.trim()) {
      setError("Please enter the OTP sent to your email")
      setLoading(false)
      return
    }

    try {
      const payload = {
        ...formData,
        otp: otpRequested ? otp.trim() : undefined,
      }

      const data = await apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify(payload), // ✅ FIX
      })

      if (data.otpRequired) {
        setOtpRequested(true)
        setInfo(data.message || "OTP sent to your college email.")
        setLoading(false)
        return
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user))
      window.dispatchEvent(new Event("auth-change"))

      await new Promise((r) => setTimeout(r, 100))

      if (data.user.role === "admin" && data.user.assignedClubId) {
        router.push(`/club-admin/${data.user.assignedClubId}`)
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
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join the college club directory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-3">
            {!otpRequested ? (
              <>
                <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <Input name="usn" placeholder="USN" value={formData.usn} onChange={handleChange} required />
                <Input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
                <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
              </>
            ) : (
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}

            {error && <div className="text-destructive">{error}</div>}
            {info && <div className="text-primary">{info}</div>}

            <Button type="submit" disabled={loading} className="w-full">
              {otpRequested ? "Verify OTP & Sign Up" : "Send OTP"}
            </Button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium">
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
