"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MessagesPage() {
  const router = useRouter()

  useEffect(() => {
    // Always redirect away from the removed messaging experience
    router.replace("/")
  }, [router])

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Messaging Unavailable</CardTitle>
            <CardDescription>Conversations have been removed from the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Direct messaging is no longer supported. Please reach out to clubs using their listed contact details.
            </p>
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
