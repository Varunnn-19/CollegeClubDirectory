"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

const quotes = [
  "Join a community, find your passion.",
  "Be part of something bigger than yourself.",
  "Discover new talents, make lasting friendships.",
  "Your journey to leadership starts here.",
  "Transform ideas into action with like-minded peers.",
]

export default function LandingPage() {
  const [randomQuote, setRandomQuote] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)])
    setIsLoggedIn(!!localStorage.getItem("currentUser"))
  }, [])

  // Redirect to home which will show landing or club list based on login status
  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
  return null

  // {/* Navigation */}
  // <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
  //   <div className="flex items-center gap-3">
  //     <img
  //       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-bMJrNgO2TXqguZRd23y5rHqvpDOIQc.jpg"
  //       alt="BMS College of Engineering"
  //       className="h-12 w-12 rounded-full shadow-lg"
  //     />
  //     <div>
  //       <p className="text-lg font-bold">BMS College</p>
  //       <p className="text-xs text-slate-400">of Engineering</p>
  //     </div>
  //   </div>
  //   <Link
  //     href="/"
  //     className="hidden md:inline-flex px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-colors"
  //   >
  //     Explore Clubs
  //   </Link>
  // </nav>

  // {/* Hero Section */}
  // <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 md:px-12 md:py-32">
  //   <div className="space-y-8 text-center">
  //     {/* Badge */}
  //     <div className="inline-block">
  //       <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 px-4 py-2 text-sm font-semibold text-blue-400 border border-blue-600/30">
  //         <span className="h-2 w-2 rounded-full bg-blue-400"></span>
  //         Welcome to Student Life
  //       </span>
  //     </div>

  //     {/* Main Heading */}
  //     <h1 className="text-balance text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
  //       Explore{" "}
  //       <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
  //         Student Clubs
  //       </span>
  //     </h1>

  //     {/* Subheading */}
  //     <p className="text-pretty text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
  //       Discover communities of passionate students. Find your tribe, develop skills, and create memories that last
  //       a lifetime.
  //     </p>

  //     {/* Quote Section */}
  //     <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-600/30 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
  //       <p className="text-xl md:text-2xl font-semibold italic text-slate-200">"{randomQuote}"</p>
  //     </div>

  //     {/* CTA Buttons */}
  //     <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
  //       <Link
  //         href={isLoggedIn ? "/" : "/sign-up"}
  //         className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-colors shadow-lg hover:shadow-xl"
  //       >
  //         {isLoggedIn ? "View Clubs" : "Start Exploring"}
  //         <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  //         </svg>
  //       </Link>
  //       <Link
  //         href="/about"
  //         className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-600 hover:border-blue-400 hover:text-blue-400 rounded-lg font-semibold transition-colors"
  //       >
  //         Learn More
  //       </Link>
  //     </div>
  //   </div>
  // </section>

  // {/* Stats Section */}
  // <section className="relative z-10 mx-auto max-w-5xl px-6 md:px-12 py-16">
  //   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
  //     <div className="text-center p-4">
  //       <p className="text-4xl md:text-5xl font-bold text-blue-400">50+</p>
  //       <p className="text-slate-400 text-sm md:text-base mt-2">Active Clubs</p>
  //     </div>
  //     <div className="text-center p-4">
  //       <p className="text-4xl md:text-5xl font-bold text-cyan-400">2000+</p>
  //       <p className="text-slate-400 text-sm md:text-base mt-2">Active Members</p>
  //     </div>
  //     <div className="text-center p-4 col-span-2 md:col-span-1">
  //       <p className="text-4xl md:text-5xl font-bold text-blue-400">100%</p>
  //       <p className="text-slate-400 text-sm md:text-base mt-2">Free to Join</p>
  //     </div>
  //   </div>
  // </section>

  // {/* Testimonial Section */}
  // <section className="relative z-10 mx-auto max-w-5xl px-6 md:px-12 py-16 mb-16">
  //   <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 md:p-12 border border-slate-700">
  //     <div className="flex gap-4 mb-6">
  //       {[...Array(5)].map((_, i) => (
  //         <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
  //           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //         </svg>
  //       ))}
  //     </div>
  //     <p className="text-lg text-slate-200 mb-6">
  //       "Joining clubs transformed my college experience. I made lifelong friends, developed new skills, and
  //       discovered passions I never knew I had. It's been incredible!"
  //     </p>
  //     <p className="font-semibold text-slate-100">Sarah Sharma</p>
  //     <p className="text-sm text-slate-400">Electronics Engineering, 3rd Year</p>
  //   </div>
  // </section>

  // {/* Floating Elements */}
  // <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
  //   <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-30"></div>
  //   <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20"></div>
  // </div>
}
