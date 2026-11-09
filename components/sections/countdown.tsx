"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"

interface AddressingPair {
  self: string
  other: string
}
const ADDRESSING_KEY = "wedding-addressing-pair"

// Ngày cưới: 11/11/2025 (22/09 ÂL). Kỷ niệm tròn 1 năm: 11/11/2026
const WEDDING_DATE = new Date("2025-11-11T10:00:00+07:00").getTime()
const ANNIVERSARY_DATE = new Date("2026-11-11T10:00:00+07:00").getTime()

const isBeforeAnniversary = () => Date.now() < ANNIVERSARY_DATE

const split = (ms: number) => ({
  days: Math.floor(ms / 86400000),
  hours: Math.floor((ms % 86400000) / 3600000),
  minutes: Math.floor((ms % 3600000) / 60000),
  seconds: Math.floor((ms % 60000) / 1000),
})

const calc = () =>
  split(isBeforeAnniversary() ? ANNIVERSARY_DATE - Date.now() : Math.max(0, Date.now() - WEDDING_DATE))

// Một chữ số lật lên khi đổi giá trị
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.15em] w-[0.62em] overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "-100%", opacity: 0, rotateX: 90 }}
          animate={{ y: "0%", opacity: 1, rotateX: 0 }}
          exit={{ y: "100%", opacity: 0, rotateX: -90 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Unit({ value, label, pad = 2, delay }: { value: number; label: string; pad?: number; delay: number }) {
  const text = value.toString().padStart(pad, "0")
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 140, damping: 16 }}
      className="relative flex flex-col items-center rounded-2xl border border-white/60 bg-white/55 px-2 py-3 shadow-[0_10px_30px_-10px_rgba(232,138,162,0.45)] backdrop-blur-md sm:px-4 sm:py-5"
    >
      <span className="absolute inset-x-3 top-1/2 h-px bg-primary/10" />
      <div className="flex font-sans text-4xl font-semibold tabular-nums text-foreground sm:text-5xl md:text-6xl">
        {text.split("").map((c, i) => (
          <Digit key={i} value={c} />
        ))}
      </div>
      <span className="mt-1 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
        {label}
      </span>
    </motion.div>
  )
}

export default function Countdown() {
  const [pair, setPair] = useState<AddressingPair>({ self: "Chúng tôi", other: "Quý vị" })
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const load = () => {
      try {
        const p: AddressingPair = JSON.parse(localStorage.getItem(ADDRESSING_KEY) || "{}")
        if (p.self && p.other) setPair(p)
      } catch (e) {}
    }
    load()
    window.addEventListener("addressing-updated", load)
    const tick = () => {
      setTime(calc())
      setProgress(Math.min(1, (Date.now() - WEDDING_DATE) / (ANNIVERSARY_DATE - WEDDING_DATE)))
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => {
      clearInterval(timer)
      window.removeEventListener("addressing-updated", load)
    }
  }, [])

  const counting = isBeforeAnniversary()
  const R = 70
  const C = 2 * Math.PI * R

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-5 py-14 md:min-h-screen">
      {/* Nền đốm sáng chuyển động */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative w-full max-w-2xl space-y-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {counting ? "Còn bao lâu nữa" : "Đã bên nhau"}
          </p>
          <h2 className="font-script text-5xl text-primary md:text-7xl">
            {counting ? "Đến Ngày Tròn Một Năm" : "Ngày Về Chung Nhà"}
          </h2>
        </motion.div>

        {/* Vòng tiến độ một năm */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.2 }}
          className="relative mx-auto h-44 w-44"
        >
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f4a6b8" />
                <stop offset="100%" stopColor="#d4a24c" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r={R} fill="none" stroke="currentColor" strokeWidth="8" className="text-primary/15" />
            <motion.circle
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - progress) }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <Heart className="h-8 w-8 fill-primary text-primary" />
            </motion.div>
            <p className="mt-1 font-sans text-2xl font-semibold text-foreground">{Math.floor(progress * 100)}%</p>
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">năm đầu tiên</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <Unit value={time.days} label="Ngày" pad={time.days >= 100 ? 3 : 2} delay={0.3} />
          <Unit value={time.hours} label="Giờ" delay={0.4} />
          <Unit value={time.minutes} label="Phút" delay={0.5} />
          <Unit value={time.seconds} label="Giây" delay={0.6} />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="space-y-2">
          <p className="font-serif text-xl font-semibold text-foreground md:text-2xl">Thứ Tư, 11 tháng 11 năm 2026</p>
          <p className="font-serif text-base italic text-muted-foreground">
            Một năm trước, ngày 11.11.2025, {pair.self.toLocaleLowerCase("vi-VN")} đã nói lời “đồng ý”
          </p>
          <p className="pt-2 font-serif text-base text-foreground/80">
            Cảm ơn <span className="font-semibold text-foreground">{pair.other}</span> đã luôn đồng hành và chung vui!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
