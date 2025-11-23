"use client"
import { useState, useEffect } from "react"
import { Hero3DScene } from "@/components/hero-3d-scene"
import { Hero3DContent } from "@/components/hero-3d-content"
import { Loading3D } from "@/components/loading-3d"

export default function LandingPage() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    // Simulate loading time for 3D scene initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isClient) return null

  if (isLoading) {
    return <Loading3D onComplete={() => setIsLoading(false)} />
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-300 relative overflow-hidden">
      {/* 3D Background Scene */}
      <Hero3DScene />
      
      {/* Hero Section with 3D Content */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Hero3DContent />
      </section>

      {/* Stats Section with glassmorphism and parallax */}
      <section 
        className="relative z-20 mx-auto max-w-6xl px-6 md:px-12 py-12"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div 
            className="text-center p-6 rounded-2xl backdrop-blur-md border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: 'rgba(159, 220, 200, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p 
              className="text-4xl md:text-5xl font-bold text-primary"
              style={{
                textShadow: '0 0 20px rgba(159, 220, 200, 0.5)'
              }}
            >
              50+
            </p>
            <p className="text-sm md:text-base mt-2 font-medium text-muted-foreground">
              Active Clubs
            </p>
          </div>
          <div 
            className="text-center p-6 rounded-2xl backdrop-blur-md border border-secondary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: 'rgba(163, 99, 93, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p 
              className="text-4xl md:text-5xl font-bold text-secondary"
              style={{
                textShadow: '0 0 20px rgba(163, 99, 93, 0.5)'
              }}
            >
              2000+
            </p>
            <p className="text-sm md:text-base mt-2 font-medium text-muted-foreground">
              Active Members
            </p>
          </div>
          <div 
            className="text-center p-6 rounded-2xl col-span-2 md:col-span-1 backdrop-blur-md border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              backgroundColor: 'rgba(159, 220, 200, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p 
              className="text-4xl md:text-5xl font-bold text-primary"
              style={{
                textShadow: '0 0 20px rgba(159, 220, 200, 0.5)'
              }}
            >
              100%
            </p>
            <p className="text-sm md:text-base mt-2 font-medium text-muted-foreground">
              Free to Join
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section with glassmorphism and parallax */}
      <section 
        className="relative z-20 mx-auto max-w-6xl px-6 md:px-12 py-12 mb-16"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        <div 
          className="rounded-3xl p-8 md:p-12 border-2 backdrop-blur-md"
          style={{ 
            backgroundColor: 'rgba(34, 17, 42, 0.8)',
            borderColor: 'rgba(159, 220, 200, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
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

      {/* Floating Elements - Background only */}
      <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: '#9fdcc8' }}
        ></div>
        <div 
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: '#a3635d' }}
        ></div>
      </div>
    </main>
  )
}
