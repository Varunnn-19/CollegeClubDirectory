"use client"

import { useEffect, useState } from "react"

export function CursorEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <>
      {/* Cursor follower */}
      <div
        className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: isHovering ? 0.3 : 0,
        }}
      >
        <div
          className="w-32 h-32 rounded-full blur-3xl transition-all duration-500"
          style={{
            background: "radial-gradient(circle, #9fdcc8 0%, #a3635d 50%, transparent 70%)",
            transform: `scale(${isHovering ? 1.5 : 1})`,
          }}
        />
      </div>

      {/* Dynamic gradient background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          opacity: isHovering ? 0.4 : 0.2,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(159, 220, 200, 0.15), rgba(163, 99, 93, 0.1), transparent 40%)`,
        }}
      />
    </>
  )
}

