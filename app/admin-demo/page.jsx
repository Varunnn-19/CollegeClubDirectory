"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDemo() {
  const router = useRouter()

  useEffect(() => {
    // Create sample users
    const sampleUsers = [
      {
        id: "1",
        name: "John Doe",
        email: "john@college.edu",
        usn: "1BM21CS001",
        yearOfStudy: "2nd Year",
        phoneNumber: "9876543210",
        role: "admin",
        password: "hashed_password_123",
      },
      {
        id: "2",
        name: "Alice Smith",
        email: "alice@college.edu",
        usn: "1BM21CS015",
        yearOfStudy: "2nd Year",
        phoneNumber: "9123456789",
        role: "user",
        password: "hashed_password_456",
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@college.edu",
        usn: "1BM21CS028",
        yearOfStudy: "1st Year",
        phoneNumber: "9987654321",
        role: "user",
        password: "hashed_password_789",
      },
      {
        id: "4",
        name: "Carol Davis",
        email: "carol@college.edu",
        usn: "1BM21CS042",
        yearOfStudy: "3rd Year",
        phoneNumber: "9876123456",
        role: "admin",
        password: "hashed_password_012",
      },
      {
        id: "5",
        name: "David Wilson",
        email: "david@college.edu",
        usn: "1BM21CS055",
        yearOfStudy: "2nd Year",
        phoneNumber: "9765432109",
        role: "user",
        password: "hashed_password_345",
      },
    ]

    // Set users in localStorage
    localStorage.setItem("users", JSON.stringify(sampleUsers))

    // Set current user as admin
    const adminUser = sampleUsers[0]
    localStorage.setItem("currentUser", JSON.stringify(adminUser))

    // Redirect to admin dashboard
    router.push("/admin/dashboard")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting up Admin Demo...</h1>
        <p className="text-gray-600">Redirecting to admin dashboard...</p>
      </div>
    </div>
  )
}
