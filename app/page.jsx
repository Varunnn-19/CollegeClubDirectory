"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { CursorEffects } from "@/components/cursor-effects"

const quotes = [
  "Join a community, find your passion.",
  "Be part of something bigger than yourself.",
  "Discover new talents, make lasting friendships.",
  "Your journey to leadership starts here.",
  "Transform ideas into action with like-minded peers.",
]

export default function LandingPage() {
  const [randomQuote, setRandomQuote] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)])
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdfceb' }}>
        <div style={{ color: '#22112a' }}>Loading...</div>
      </main>
    )
  }

  const [mousePosition, setMousePosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  })
  const sectionRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Initialize to center
    setMousePosition({ 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    })

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <main 
      className="min-h-screen relative overflow-hidden" 
      style={{ backgroundColor: '#fdfceb' }}
      ref={sectionRef}
    >
      {/* Dynamic gradient background that follows cursor */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(159, 220, 200, 0.2), rgba(163, 99, 93, 0.1), transparent 50%)`,
        }}
      />

      {/* Cursor follower glow */}
      <div
        className="fixed pointer-events-none z-40 transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(159, 220, 200, 0.3) 0%, rgba(163, 99, 93, 0.2) 50%, transparent 70%)",
          filter: "blur(40px)",
          opacity: 0.4,
        }}
      />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-20">
        <div className="space-y-10 text-center">
          {/* Badge */}
          <div 
            className="inline-block transform transition-all duration-500 hover:scale-110"
            style={{
              transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.01}px, ${(mousePosition.y - window.innerHeight / 2) * 0.01}px)` : 'none',
            }}
          >
            <span 
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border-2 transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: '#9fdcc8',
                color: '#22112a',
                borderColor: '#9fdcc8'
              }}
            >
              <span 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: '#22112a' }}
              ></span>
              Welcome to Student Life
            </span>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-balance text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight transition-transform duration-700"
            style={{ 
              color: '#22112a',
              transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.005}px, ${(mousePosition.y - window.innerHeight / 2) * 0.005}px)` : 'none',
            }}
          >
            Explore{" "}
            <span 
              className="text-transparent bg-clip-text transition-all duration-500 hover:scale-105 inline-block"
              style={{ 
                backgroundImage: typeof window !== 'undefined' ? `linear-gradient(${Math.atan2(mousePosition.y - window.innerHeight / 2, mousePosition.x - window.innerWidth / 2) * 180 / Math.PI}deg, #9fdcc8, #a3635d)` : 'linear-gradient(to right, #9fdcc8, #a3635d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Student Clubs
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-pretty text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: '#4a3a4f' }}
          >
            Discover communities of passionate students. Find your tribe, develop skills, and create memories that last
            a lifetime.
          </p>

          {/* Quote Section */}
          <div 
            className="rounded-3xl p-8 md:p-12 backdrop-blur-sm border-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
            style={{ 
              backgroundColor: 'rgba(159, 220, 200, 0.15)',
              borderColor: '#9fdcc8',
              transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.008}px, ${(mousePosition.y - window.innerHeight / 2) * 0.008}px)` : 'none',
            }}
          >
            <p 
              className="text-xl md:text-2xl font-semibold italic"
              style={{ color: '#22112a' }}
            >
              "{randomQuote}"
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/clubs"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
              style={{ 
                backgroundColor: '#9fdcc8',
                color: '#22112a'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{
                  background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.3), transparent 70%)`
                }}
              />
              <span className="relative z-10">
                Start Exploring
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 rounded-xl font-semibold transition-all hover:shadow-md transform hover:-translate-y-1 hover:scale-105 hover:bg-a3635d/10 relative overflow-hidden group"
              style={{ 
                borderColor: '#a3635d',
                color: '#a3635d'
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{
                  background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(163, 99, 93, 0.2), transparent 70%)`
                }}
              />
              <span className="relative z-10">Learn More</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div 
            className="text-center p-6 rounded-2xl transition-all duration-500 hover:scale-110 hover:shadow-xl cursor-pointer"
            style={{ 
              backgroundColor: 'rgba(159, 220, 200, 0.2)',
              transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.003}px, ${(mousePosition.y - window.innerHeight / 2) * 0.003}px)` : 'none',
            }}
          >
            <p 
              className="text-4xl md:text-5xl font-bold"
              style={{ color: '#9fdcc8' }}
            >
              50+
            </p>
            <p 
              className="text-sm md:text-base mt-2 font-medium"
              style={{ color: '#4a3a4f' }}
            >
              Active Clubs
            </p>
          </div>
          <div 
            className="text-center p-6 rounded-2xl transition-all duration-500 hover:scale-110 hover:shadow-xl cursor-pointer"
            style={{ 
              backgroundColor: 'rgba(163, 99, 93, 0.15)',
              transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.003}px, ${(mousePosition.y - window.innerHeight / 2) * 0.003}px)` : 'none',
            }}
          >
            <p 
              className="text-4xl md:text-5xl font-bold"
              style={{ color: '#a3635d' }}
            >
              2000+
            </p>
            <p 
              className="text-sm md:text-base mt-2 font-medium"
              style={{ color: '#4a3a4f' }}
            >
              Active Members
            </p>
          </div>
          <div 
            className="text-center p-6 rounded-2xl col-span-2 md:col-span-1 transition-all duration-500 hover:scale-110 hover:shadow-xl cursor-pointer"
            style={{ 
              backgroundColor: 'rgba(159, 220, 200, 0.2)',
              transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.003}px, ${(mousePosition.y - window.innerHeight / 2) * 0.003}px)` : 'none',
            }}
          >
            <p 
              className="text-4xl md:text-5xl font-bold"
              style={{ color: '#9fdcc8' }}
            >
              100%
            </p>
            <p 
              className="text-sm md:text-base mt-2 font-medium"
              style={{ color: '#4a3a4f' }}
            >
              Free to Join
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 py-12 mb-16">
        <div 
          className="rounded-3xl p-8 md:p-12 border-2 transition-all duration-700 hover:shadow-2xl hover:scale-[1.01]"
          style={{ 
            backgroundColor: '#22112a',
            borderColor: '#9fdcc8',
            transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.006}px, ${(mousePosition.y - window.innerHeight / 2) * 0.006}px)` : 'none',
          }}
        >
          <div className="flex gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                style={{ color: '#a3635d' }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p 
            className="text-lg mb-6"
            style={{ color: '#fdfceb' }}
          >
            "Joining clubs transformed my college experience. I made lifelong friends, developed new skills, and
            discovered passions I never knew I had. It's been incredible!"
          </p>
          <p 
            className="font-semibold"
            style={{ color: '#9fdcc8' }}
          >
            Sarah Sharma
          </p>
          <p 
            className="text-sm"
            style={{ color: '#a3635d' }}
          >
            Electronics Engineering, 3rd Year
          </p>
        </div>
      </section>

      {/* Floating Elements with cursor interaction */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl transition-all duration-1000"
          style={{ 
            backgroundColor: '#9fdcc8',
            opacity: 0.2,
            transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x - window.innerWidth) * 0.05}px, ${(mousePosition.y - window.innerHeight) * 0.05}px)` : 'none',
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl transition-all duration-1000"
          style={{ 
            backgroundColor: '#a3635d',
            opacity: 0.15,
            transform: typeof window !== 'undefined' ? `translate(${(mousePosition.x) * 0.05}px, ${(mousePosition.y - window.innerHeight) * 0.05}px)` : 'none',
          }}
        ></div>
      </div>
    </main>
  )
}
