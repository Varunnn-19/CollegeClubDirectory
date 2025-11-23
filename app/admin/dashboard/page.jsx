"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")

    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }

    setCurrentUser(user)
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(allUsers)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.filter((u) => u.role === "user").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">USN</th>
                    <th className="text-left py-2">Year</th>
                    <th className="text-left py-2">Phone</th>
                    <th className="text-left py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">{user.usn}</td>
                      <td className="py-3">{user.yearOfStudy}</td>
                      <td className="py-3">{user.phoneNumber}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role === "admin" ? "bg-destructive/20 text-destructive dark:bg-destructive/30" : "bg-primary/20 text-primary dark:bg-primary/30"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
