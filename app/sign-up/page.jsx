"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { clubs } from "@/lib/clubs"

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
    assignedClubId: "", // added club assignment for admins
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Phone number must be 10 digits")
      setLoading(false)
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (users.find((u) => u.email === formData.email)) {
        setError("Email already registered")
        setLoading(false)
        return
      }

      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        usn: formData.usn,
        yearOfStudy: formData.yearOfStudy,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
        assignedClubId: formData.assignedClubId, // store assigned club
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      
      // Dispatch event and wait a bit to ensure state updates
      window.dispatchEvent(new Event("auth-change"))
      
      // Small delay to ensure header state updates before navigation
      await new Promise(resolve => setTimeout(resolve, 100))

      if (newUser.role === "admin") {
        router.push(`/club-admin/${newUser.assignedClubId}`)
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join the college club directory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-3">
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
                placeholder="john@college.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">USN (University Serial Number)</label>
              <Input
                type="text"
                name="usn"
                placeholder="1BM21CS001"
                value={formData.usn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Year of Study</label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
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
              <label className="text-sm font-medium">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="user">Regular User</option>
                <option value="admin">Club Admin</option>
              </select>
            </div>

            {formData.role === "admin" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Select Club to Manage</label>
                <select
                  name="assignedClubId"
                  value={formData.assignedClubId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required={formData.role === "admin"}
                >
                  <option value="">Select a club</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
            {error && <div className="text-destructive text-sm bg-destructive/10 dark:bg-destructive/20 border border-destructive/20 p-3 rounded">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
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
