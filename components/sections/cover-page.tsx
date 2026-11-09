"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Heart } from "lucide-react"

interface AddressingPair {
  self: string
  other: string
}
const ADDRESSING_KEY = "wedding-addressing-pair"

// Ảnh nền đổi chậm, hiệu ứng Ken Burns
const BACKDROPS = [
  "/gallery/anniversary/tan-hon-KHA03792.jpg",
  "/gallery/DSC00682.jpg",
  "/gallery/anniversary/tan-hon-KHA04124.jpg",
  "/gallery/DSC00575.jpg",
  "/gallery/anniversary/tan-hon-KHA04063.jpg",
]

function Letters({ text, delay, className }: { text: string; delay: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: delay + i * 0.09, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export default function CoverPage() {
  const [self, setSelf] = useState("Chúng tôi")
  const [bg, setBg] = useState(0)

  useEffect(() => {
    const load = () => {
      try {
        const p: AddressingPair = JSON.parse(localStorage.getItem(ADDRESSING_KEY) || "{}")
        if (p.self) setSelf(p.self)
      } catch (e) {}
    }
    load()
    window.addEventListener("addressing-updated", load)
    const t = setInterval(() => setBg((b) => (b + 1) % BACKDROPS.length), 6500)
    return () => {
      clearInterval(t)
      window.removeEventListener("addressing-updated", load)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center md:px-12">
      {/* Ảnh nền */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-rose-400 to-amber-200">
        <AnimatePresence>
          <motion.div
            key={bg}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.8 }, scale: { duration: 8, ease: "linear" } }}
          >
            <Image src={BACKDROPS[bg]} alt="" fill priority={bg === 0} sizes="100vw" className="object-cover object-[50%_30%]" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* Hạt sáng bay lên */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-amber-100/80 shadow-[0_0_8px_2px_rgba(255,236,179,0.7)]"
          style={{ left: `${(i * 53) % 100}%`, bottom: -10 }}
          animate={{ y: [0, -900], opacity: [0, 1, 0] }}
          transition={{ duration: 7 + (i % 5), repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
        />
      ))}

      <div className="relative z-10 space-y-7 md:space-y-10">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.45em" }}
          transition={{ duration: 1.6, delay: 0.2 }}
          className="font-sans text-[11px] uppercase text-white/85 md:text-sm"
        >
          Kỷ niệm một năm ngày cưới
        </motion.p>

        <div className="space-y-1 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <h1 className="font-script text-7xl sm:text-8xl md:text-9xl">
            <Letters text="Nghĩa" delay={0.6} />
          </h1>
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 1.3, stiffness: 160 }}
            className="flex items-center justify-center gap-4"
          >
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-amber-200 md:w-28" />
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <Heart className="h-7 w-7 fill-rose-400 text-rose-300 md:h-9 md:w-9" />
            </motion.span>
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-amber-200 md:w-28" />
          </motion.div>
          <h1 className="font-script text-7xl sm:text-8xl md:text-9xl">
            <Letters text="Nhung" delay={1.5} />
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 1 }}
          className="space-y-3"
        >
          <p className="text-shimmer font-serif text-3xl font-bold tracking-wide md:text-5xl">11 · 11 · 2026</p>
          <p className="font-serif text-lg italic text-white/90 md:text-2xl">
            {self} tròn một năm về chung một nhà
          </p>
          <p className="font-sans text-xs tracking-[0.3em] text-white/70 md:text-sm">11.11.2025 — 11.11.2026</p>
        </motion.div>
      </div>
    </div>
  )
}
