"use client"

import { useEffect, useState } from "react"

interface Petal {
  id: number
  left: string
  animationDuration: string
  animationDelay: string
  size: number
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${15 + Math.random() * 15}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: 8 + Math.random() * 12,
    }))
    setPetals(newPetals)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal absolute"
          style={{
            left: petal.left,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
              fill="oklch(0.85 0.08 15 / 0.4)"
            />
            <path
              d="M12 22C12 22 16 18 16 14C16 11.7909 14.2091 10 12 10C9.79086 10 8 11.7909 8 14C8 18 12 22 12 22Z"
              fill="oklch(0.85 0.08 15 / 0.3)"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
