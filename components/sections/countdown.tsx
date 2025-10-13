"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface AddressingPair {
  self: string;
  other: string;
}
const ADDRESSING_KEY = "wedding-addressing-pair";

const ELEGANT_STYLE = "font-script text-primary text-2xl drop-shadow-sm shadow-dark";

export default function Countdown() {
  const [addressingPair, setAddressingPair] = useState<AddressingPair>({
    self: "Chúng tôi",
    other: "Quý vị",
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const storedPair = localStorage.getItem(ADDRESSING_KEY);
    if (storedPair) {
      try {
        const parsedPair: AddressingPair = JSON.parse(storedPair);
        if (parsedPair.self && parsedPair.other) {
          setAddressingPair(parsedPair);
        }
      } catch (e) {
        // Giữ giá trị mặc định nếu có lỗi
      }
    }

    const weddingDate = new Date("2025-11-23T00:00:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = weddingDate - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeUnits = [
    { label: "Ngày", value: timeLeft.days },
    { label: "Giờ", value: timeLeft.hours },
    { label: "Phút", value: timeLeft.minutes },
    { label: "Giây", value: timeLeft.seconds },
  ]

  const selfAddressing = addressingPair.self;
  const selfAddressingLowerCase = addressingPair.self.toLocaleLowerCase('vi-VN');
  const otherAddressing = addressingPair.other;


  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-10 text-center"
      >
        <div className="space-y-4">
          <h2 className="font-script text-5xl text-primary">Đếm Ngược</h2>
          <p className="font-serif text-lg text-muted-foreground">
            Cho đến khi <span className="text-foreground font-semibold">{selfAddressingLowerCase}</span><br/><span className={ELEGANT_STYLE}>Chính thức về chung một nhà ^^</span>
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 sm:gap-6">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-card p-4 shadow-lg sm:p-6"
            >
              <div className="text-3xl font-bold text-primary sm:text-4xl">
                {unit.value.toString().padStart(2, "0")}
              </div>
              <div className="mt-0 space-y-1">
                <div className="text-xs font-medium text-foreground sm:text-sm">{unit.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="font-serif text-base text-muted-foreground">
          <span className="text-foreground font-semibold">{selfAddressing}</span> <span className={''}>chân thành mong được chung vui cùng</span> <span className="text-foreground font-semibold">{otherAddressing}</span>!
        </p>
      </motion.div>
    </div>
  )
}