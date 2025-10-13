"use client"

import type React from "react"

export default function VietnameseFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 p-8">
      <div className="relative">
        {/* Vietnamese traditional wedding card frame with dragon and phoenix */}
        <div
          className="absolute inset-0 -m-8 rounded-[4rem]"
          style={{
            background: `
              linear-gradient(135deg, 
                oklch(0.92 0.08 15) 0%, 
                oklch(0.88 0.10 20) 50%, 
                oklch(0.90 0.08 25) 100%
              )
            `,
            boxShadow: `
              0 0 0 8px oklch(0.75 0.15 30),
              0 0 0 12px oklch(0.85 0.12 25),
              0 20px 60px rgba(0,0,0,0.15)
            `,
          }}
        >
          {/* Embossed double happiness and dragon-phoenix pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 35px, oklch(0.80 0.12 20) 35px, oklch(0.80 0.12 20) 70px),
                repeating-linear-gradient(-45deg, transparent, transparent 35px, oklch(0.80 0.12 20) 35px, oklch(0.80 0.12 20) 70px)
              `,
            }}
          />

          {/* Corner decorations - Dragon and Phoenix motifs */}
          <svg className="absolute left-4 top-4 h-20 w-20 text-primary/30" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 Q30 30 30 50 Q30 70 50 90 Q70 70 70 50 Q70 30 50 10 M50 25 Q40 35 40 50 Q40 65 50 75 Q60 65 60 50 Q60 35 50 25" />
          </svg>
          <svg className="absolute right-4 top-4 h-20 w-20 text-primary/30" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 Q70 30 70 50 Q70 70 50 90 Q30 70 30 50 Q30 30 50 10 M50 25 Q60 35 60 50 Q60 65 50 75 Q40 65 40 50 Q40 35 50 25" />
          </svg>
          <svg className="absolute bottom-4 left-4 h-20 w-20 text-primary/30" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 90 Q30 70 30 50 Q30 30 50 10 Q70 30 70 50 Q70 70 50 90 M50 75 Q40 65 40 50 Q40 35 50 25 Q60 35 60 50 Q60 65 50 75" />
          </svg>
          <svg
            className="absolute bottom-4 right-4 h-20 w-20 text-primary/30"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 90 Q70 70 70 50 Q70 30 50 10 Q30 30 30 50 Q30 70 50 90 M50 75 Q60 65 60 50 Q60 35 50 25 Q40 35 40 50 Q40 65 50 75" />
          </svg>
        </div>

        {/* Phone frame */}
        <div className="relative z-10 h-[800px] w-[380px] overflow-hidden rounded-[3rem] border-[14px] border-foreground/90 bg-background shadow-2xl">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-50 h-7 w-40 -translate-x-1/2 rounded-b-3xl bg-foreground" />

          {/* Screen content */}
          <div className="h-full w-full overflow-hidden">{children}</div>
        </div>

        {/* Power button */}
        <div className="absolute -right-1 top-32 z-10 h-16 w-1 rounded-l-lg bg-foreground/80" />

        {/* Volume buttons */}
        <div className="absolute -left-1 top-28 z-10 h-12 w-1 rounded-r-lg bg-foreground/80" />
        <div className="absolute -left-1 top-44 z-10 h-12 w-1 rounded-r-lg bg-foreground/80" />
      </div>
    </div>
  )
}
