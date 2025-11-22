"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")
    setCurrentUser(user)

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("currentUser") || "null")
      setCurrentUser(updatedUser)
    }

    window.addEventListener("storage", handleStorageChange)
        window.addEventListener("auth-change", handleStorageChange)
    return () =>  {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("auth-change", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    router.push("/")
  }


  return (
    <header 
      className="border-b z-[100] sticky top-0 backdrop-blur-md"
      style={{ 
        backgroundColor: 'rgba(253, 252, 235, 0.95)',
        borderColor: '#9fdcc8'
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-3 md:px-6 flex justify-center items-center gap-4">
        <div className="relative">
          <Image
            src="/bms-logo.jpg"
            alt="BMS College of Engineering Logo"
            width={80}
            height={80}
            priority
            className="rounded-full shadow-lg border-2 hover:shadow-xl transition-shadow"
            style={{ borderColor: '#9fdcc8' }}
          />
        </div>
        <p 
          className="text-center text-lg font-bold tracking-wide md:text-xl"
          style={{ color: '#22112a' }}
        >
          BMS COLLEGE OF ENGINEERING
        </p>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="College Club Directory Home">
          <span 
            className="font-semibold tracking-tight flex items-center"
            style={{ color: '#22112a' }}
          >
            <BookOpen className="h-5 w-5 mr-2" style={{ color: '#9fdcc8' }} /> Club Directory
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
            style={{ 
              color: '#22112a',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9fdcc8'
              e.currentTarget.style.color = '#22112a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#22112a'
            }}
            href="/"
          >
            Home
          </Link>
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
            style={{ 
              color: '#22112a',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9fdcc8'
              e.currentTarget.style.color = '#22112a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#22112a'
            }}
            href="/clubs"
          >
            Clubs
          </Link>
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
            style={{ 
              color: '#22112a',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9fdcc8'
              e.currentTarget.style.color = '#22112a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#22112a'
            }}
            href="/about"
          >
            About
          </Link>
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
            style={{ 
              color: '#22112a',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9fdcc8'
              e.currentTarget.style.color = '#22112a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#22112a'
            }}
            href="/contact"
          >
            Contact
          </Link>
          {mounted && currentUser && (
            <>
              <Link 
                className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                style={{ 
                  color: '#22112a',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9fdcc8'
                  e.currentTarget.style.color = '#22112a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#22112a'
                }}
                href="/profile"
              >
                Profile
              </Link>
              <Link 
                className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                style={{ 
                  color: '#22112a',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9fdcc8'
                  e.currentTarget.style.color = '#22112a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#22112a'
                }}
                href="/messages"
              >
                Messages
              </Link>
              <Link 
                className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                style={{ 
                  color: '#22112a',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9fdcc8'
                  e.currentTarget.style.color = '#22112a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#22112a'
                }}
                href="/create-club"
              >
                Create Club
              </Link>
            </>
          )}
          {currentUser?.role === "admin" && currentUser?.assignedClubId && (
            <Link 
              className="text-sm px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
              style={{ 
                color: '#22112a',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#a3635d'
                e.currentTarget.style.color = '#fdfceb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#22112a'
              }}
              href={`/club-admin/${String(currentUser.assignedClubId)}`}
            >
              My Club
            </Link>
          )}
        {mounted && currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium" style={{ color: '#4a3a4f' }}>{currentUser?.name || 'User'}</span>
              <Button 
                size="sm" 
                onClick={handleLogout} 
                variant="outline"
                style={{
                  borderColor: '#a3635d',
                  color: '#a3635d'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#a3635d'
                  e.currentTarget.style.color = '#fdfceb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#a3635d'
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button 
                  size="sm" 
                  variant="outline"
                  style={{
                    borderColor: '#9fdcc8',
                    color: '#22112a'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#9fdcc8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button 
                  size="sm"
                  style={{
                    backgroundColor: '#9fdcc8',
                    color: '#22112a',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>

        <Button
          variant="outline"
          className="md:hidden bg-transparent"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          {open ? "Close" : "Menu"}
        </Button>
      </div>

      <div id="mobile-menu" className={cn("border-t md:hidden", open ? "block" : "hidden")}>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 md:px-6">
          <Link onClick={() => setOpen(false)} className="py-2" href="/">
            Home
          </Link>
          <Link onClick={() => setOpen(false)} className="py-2" href="/clubs">
            Clubs
          </Link>
          <Link onClick={() => setOpen(false)} className="py-2" href="/about">
            About
          </Link>
          <Link onClick={() => setOpen(false)} className="py-2" href="/contact">
            Contact
          </Link>
          {mounted && currentUser && (
            <>
              <Link onClick={() => setOpen(false)} className="py-2" href="/profile">
                Profile
              </Link>
              <Link onClick={() => setOpen(false)} className="py-2" href="/messages">
                Messages
              </Link>
              <Link onClick={() => setOpen(false)} className="py-2" href="/create-club">
                Create Club
              </Link>
            </>
          )}
          {currentUser?.role === "admin" && currentUser?.assignedClubId && (
            <Link onClick={() => setOpen(false)} className="py-2" href={`/club-admin/${String(currentUser.assignedClubId)}`}>
              My Club
            </Link>
          )}
          {currentUser ? (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">{currentUser?.name || 'User'}</span>
              <Button size="sm" onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Link onClick={() => setOpen(false)} href="/sign-in">
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link onClick={() => setOpen(false)} href="/sign-up">
                <Button size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
