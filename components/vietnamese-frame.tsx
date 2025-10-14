"use client"

import type React from "react"

export default function VietnameseFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 p-8">
      {children}
    </div>
  )
}
