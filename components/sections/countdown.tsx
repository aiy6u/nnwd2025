"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Heart, MapPin } from "lucide-react"

interface TimeTogether {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface AddressingPair {
  self: string
  other: string
}

const ADDRESSING_KEY = "wedding-addressing-pair"
const ELEGANT_STYLE = "font-script text-primary text-2xl drop-shadow-sm shadow-dark"

// Ngày cưới: Thứ 3, ngày 11 tháng 11 năm 2025 (Nhằm ngày 22 tháng 9 âm lịch)
const WEDDING_DATE = new Date("2025-11-11T10:00:00+07:00").getTime()

// Kỷ niệm tròn 1 năm: Thứ 4, ngày 11 tháng 11 năm 2026
const ANNIVERSARY_DATE = new Date("2026-11-11T10:00:00+07:00").getTime()

// Trước ngày kỷ niệm: đếm ngược tới 11/11/2026. Từ ngày kỷ niệm: đếm thời gian đã bên nhau.
const isBeforeAnniversary = () => Date.now() < ANNIVERSARY_DATE

const calculateTimeTogether = (): TimeTogether => {
  const distance = isBeforeAnniversary() ? ANNIVERSARY_DATE - Date.now() : Math.max(0, Date.now() - WEDDING_DATE)
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  }
}

export default function Countdown() {
  const [addressingPair, setAddressingPair] = useState<AddressingPair>({ self: "Chúng tôi", other: "Quý vị" })
  const [time, setTime] = useState<TimeTogether>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const loadAddressing = () => {
      const storedPair = localStorage.getItem(ADDRESSING_KEY)
      if (!storedPair) return
      try {
        const parsedPair: AddressingPair = JSON.parse(storedPair)
        if (parsedPair.self && parsedPair.other) setAddressingPair(parsedPair)
      } catch (e) {}
    }

    loadAddressing()
    window.addEventListener("addressing-updated", loadAddressing)

    setTime(calculateTimeTogether())
    const timer = setInterval(() => setTime(calculateTimeTogether()), 1000)

    return () => {
      clearInterval(timer)
      window.removeEventListener("addressing-updated", loadAddressing)
    }
  }, [])

  const timeUnits = [
    { label: "NGÀY", value: time.days },
    { label: "GIỜ", value: time.hours },
    { label: "PHÚT", value: time.minutes },
    { label: "GIÂY", value: time.seconds },
  ]

  const selfAddressing = addressingPair.self.toLocaleLowerCase("vi-VN")
  const counting = isBeforeAnniversary()

  return (
    <div className="flex min-h-full md:min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-12 text-center"
      >
        <div className="space-y-4">
          <h2 className="font-script text-5xl text-primary">{counting ? "Đếm Ngược" : "Bên Nhau"}</h2>
          <p className="font-serif text-lg text-muted-foreground">
            {counting ? "Cho đến ngày " : "Kể từ ngày "}
            <span className="text-foreground font-semibold">{selfAddressing}</span>
            <br />
            <span className={ELEGANT_STYLE}>{counting ? "Tròn 1 năm về chung một nhà ^^" : "Chính thức về chung một nhà ^^"}</span>
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 rounded-2xl bg-card p-6 shadow-xl border border-primary/20"
        >
          <h3 className="font-serif text-lg font-bold text-primary uppercase">Kỷ niệm 1 năm ngày cưới</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4 text-foreground" />
              <p className="text-sm font-semibold text-foreground md:text-base">
                <span className="font-extrabold">Thứ 4, 11 Tháng 11, 2026</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <p className="text-sm">Ngày cưới: Thứ 3, 11/11/2025 (22/09 ÂL)</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="rounded-xl bg-background/50 p-2 shadow-inner border border-primary/20"
              >
                <div className="text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">
                  {unit.value.toString().padStart(2, "0")}
                </div>
                <div className="mt-0 text-[10px] font-medium text-muted-foreground uppercase sm:text-xs">
                  {unit.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart className="h-4 w-4 fill-primary" />
            <p className="font-serif text-sm">Một năm hạnh phúc và còn mãi về sau</p>
            <Heart className="h-4 w-4 fill-primary" />
          </div>
        </motion.div>

        <p className="font-serif text-base text-muted-foreground pt-4">
          <span className="text-foreground font-semibold">{addressingPair.self}</span>{" "}
          chân thành cảm ơn{" "}
          <span className="text-foreground font-semibold">{addressingPair.other}</span>{" "}
          đã luôn đồng hành và chung vui!
        </p>
      </motion.div>
    </div>
  )
}
