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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
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

    try {
      /* =====================
         STEP 1: SEND OTP
      ===================== */
      if (!otpRequested) {
        if (!formData.email.endsWith("@bmsce.ac.in")) {
          throw new Error("Email must be from @bmsce.ac.in domain")
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }

        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          usn: formData.usn,
          yearOfStudy: formData.yearOfStudy,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          assignedClubId: formData.role === "admin" ? formData.assignedClubId : "",
        }

        const res = await apiRequest("/users/register", {
          method: "POST",
          body: payload,
        })

        if (res.otpRequired) {
          setOtpRequested(true)
          setInfo(res.message || "OTP sent to your college email.")
          return
        }
      }

      /* =====================
         STEP 2: VERIFY OTP
      ===================== */
      if (!otp.trim()) {
        throw new Error("Please enter the OTP sent to your email")
      }

      const verifyRes = await apiRequest("/users/register", {
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
          otp: otp.trim(),
        },
      })

      localStorage.setItem("currentUser", JSON.stringify(verifyRes.user))
      window.dispatchEvent(new Event("auth-change"))

      router.push("/")
    } catch (err) {
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join the college club directory</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-3">

            {!otpRequested ? (
              <>
                <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <Input name="email" type="email" placeholder="your@bmsce.ac.in" value={formData.email} onChange={handleChange} required />
                <Input name="usn" placeholder="USN" value={formData.usn} onChange={handleChange} required />

                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>

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

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {info && <p className="text-green-600 text-sm">{info}</p>}

            <Button className="w-full" disabled={loading}>
              {loading ? "Processing..." : otpRequested ? "Verify OTP" : "Send OTP"}
            </Button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
