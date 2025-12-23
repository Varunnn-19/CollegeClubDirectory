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

    try {
      /* =====================
         STEP 1: SEND OTP
      ===================== */
      if (!otpRequested) {
        if (
          !formData.name ||
          !formData.email ||
          !formData.usn ||
          !formData.yearOfStudy ||
          !formData.phoneNumber ||
          !formData.password
        ) {
          throw new Error("All fields are required")
        }

        if (!formData.email.endsWith("@bmsce.ac.in")) {
          throw new Error("Email must be from @bmsce.ac.in domain")
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }

        if (formData.role === "admin" && !formData.assignedClubId) {
          throw new Error("Please select a club to manage")
        }

        const passwordRegex =
          /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{6,}$/

        if (!passwordRegex.test(formData.password)) {
          throw new Error(
            "Password must contain at least one uppercase letter, one special character, and one number"
          )
        }

        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          usn: formData.usn,
          yearOfStudy: formData.yearOfStudy,
          phoneNumber: formData.phoneNumber,
          role: formData.role,
          assignedClubId:
            formData.role === "admin" ? formData.assignedClubId : "",
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

      localStorage.setItem(
        "currentUser",
        JSON.stringify(verifyRes.user)
      )
      window.dispatchEvent(new Event("auth-change"))

      if (
        verifyRes.user.role === "admin" &&
        verifyRes.user.assignedClubId
      ) {
        router.push(`/club-admin/${verifyRes.user.assignedClubId}`)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join the college club directory
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-3">
            {!otpRequested ? (
              <>
                <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <Input name="email" type="email" placeholder="john@bmsce.ac.in" value={formData.email} onChange={handleChange} required />
                <Input name="usn" placeholder="USN" value={formData.usn} onChange={handleChange} required />

                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>

                <Input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Club Admin</option>
                </select>

                {formData.role === "admin" && (
                  <select
                    name="assignedClubId"
                    value={formData.assignedClubId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select a club</option>
                    {clubOptions.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                )}

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
              {loading
                ? "Processing..."
                : otpRequested
                ? "Verify OTP & Sign Up"
                : "Send OTP"}
            </Button>

            {otpRequested && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setOtpRequested(false)
                  setOtp("")
                  setInfo("")
                }}
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
