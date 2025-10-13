"use client"

import type React from "react"

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted/30 to-accent/20 p-8">
      <div className="relative">
        {/* Phone frame */}
        <div className="relative h-[800px] w-[380px] overflow-hidden rounded-[3rem] border-[14px] border-foreground/90 bg-foreground shadow-2xl">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-50 h-7 w-40 -translate-x-1/2 rounded-b-3xl bg-foreground" />

          {/* Screen content */}
          <div className="h-full w-full overflow-y-auto overflow-x-hidden">{children}</div>
        </div>

        {/* Power button */}
        <div className="absolute -right-1 top-32 h-16 w-1 rounded-l-lg bg-foreground/80" />

        {/* Volume buttons */}
        <div className="absolute -left-1 top-28 h-12 w-1 rounded-r-lg bg-foreground/80" />
        <div className="absolute -left-1 top-44 h-12 w-1 rounded-r-lg bg-foreground/80" />
      </div>
    </div>
  )
}
