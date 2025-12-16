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
    const checkUser = () => {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "null")
        setCurrentUser(user)
      } catch (error) {
        setCurrentUser(null)
      }
    }
    checkUser()

    const handleStorageChange = () => {
      checkUser()
    }

    const handleAuthChange = () => {
      // Small delay to ensure localStorage is updated
      setTimeout(checkUser, 50)
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("auth-change", handleAuthChange)
    
    // Check user state periodically (but less frequently)
    const interval = setInterval(checkUser, 500)
    
    return () =>  {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("auth-change", handleAuthChange)
      clearInterval(interval)
    }
  }, [])

  // Force header to stay fixed at top - prevent any scroll movement
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return

    const enforceFixedPosition = () => {
      if (header) {
        header.style.position = 'fixed'
        header.style.top = '0'
        header.style.left = '0'
        header.style.right = '0'
        header.style.transform = 'translate3d(0, 0, 0)'
        header.style.zIndex = '9999'
        header.style.width = '100%'
      }
    }

    // Enforce on mount
    enforceFixedPosition()

    // Enforce on scroll
    const handleScroll = () => {
      enforceFixedPosition()
    }

    // Enforce on resize
    const handleResize = () => {
      enforceFixedPosition()
    }

    // Use requestAnimationFrame for smooth enforcement
    let rafId = null
    const enforceLoop = () => {
      enforceFixedPosition()
      rafId = requestAnimationFrame(enforceLoop)
    }
    rafId = requestAnimationFrame(enforceLoop)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    router.push("/")
  }


  return (
    <header 
      className="border-b z-[9999] fixed top-0 left-0 right-0 backdrop-blur-md bg-background/95 border-border transition-colors duration-300 shadow-sm"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 9999,
        willChange: 'auto',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
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
        <p className="text-center text-lg font-bold tracking-wide md:text-xl text-foreground">
          BMS COLLEGE OF ENGINEERING
        </p>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2" aria-label="College Club Directory">
          <span className="font-semibold tracking-tight flex items-center text-foreground">
            <BookOpen className="h-5 w-5 mr-2 text-primary" /> Club Directory
          </span>
        </div>

        <nav className="hidden items-center gap-4 md:flex">
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
            href="/"
          >
            Home
          </Link>
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
            href="/clubs"
          >
            Clubs
          </Link>
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
            href="/about"
          >
            About
          </Link>
          <Link 
            className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
            href="/contact"
          >
            Contact
          </Link>
          {mounted && currentUser && (
            <>
              <Link 
                className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                href="/profile"
              >
                Profile
              </Link>
              <Link 
                className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                href="/messages"
              >
                Messages
              </Link>
              <Link 
                className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                href="/create-club"
              >
                Create Club
              </Link>
            </>
          )}
          {currentUser?.role === "admin" && (
            <>
              <Link 
                className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:scale-105 active:scale-95"
                href="/admin/dashboard"
              >
                Approve Clubs
              </Link>
              {currentUser.assignedClubId && (
                <Link 
                  className="text-sm px-4 py-2 rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:scale-105 active:scale-95"
                  href={`/club-admin/${currentUser.assignedClubId}`}
                >
                  My Club
                </Link>
              )}
            </>
          )}
        <div className="flex items-center gap-2">
          {mounted && currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
              <Button 
                size="sm" 
                onClick={handleLogout} 
                variant="outline"
                className="transition-all duration-300 hover:scale-105 active:scale-95"
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
                  className="transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button 
                  size="sm"
                  className="transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
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
          {currentUser?.role === "admin" && (
            <>
              <Link onClick={() => setOpen(false)} className="py-2" href="/admin/dashboard">
                Approve Clubs
              </Link>
              {currentUser.assignedClubId && (
                <Link onClick={() => setOpen(false)} className="py-2" href={`/club-admin/${currentUser.assignedClubId}`}>
                  My Club
                </Link>
              )}
            </>
          )}
          {currentUser ? (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">{currentUser.name}</span>
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
