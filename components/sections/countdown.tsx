"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface AddressingPair {
  self: string
  other: string
}

interface WeddingEvent {
  id: string
  title: string
  date: Date
  dateString: string
  lunarDate: string
  location: string
  time: string
  timeLeft: TimeLeft
}

const ADDRESSING_KEY = "wedding-addressing-pair"
const ELEGANT_STYLE = "font-script text-primary text-2xl drop-shadow-sm shadow-dark"

// Dữ liệu đã lưu:
// Nhà gái: Thứ 5 ngày 6 tháng 11 năm 2025 (Nhằm ngày 17 tháng 9 âm lịch)
// Nhà Trai: Thứ 3, ngày 11 tháng 11 năm 2025 (Nhằm ngày 22, tháng 9 âm lịch)

// Giả định thời gian tổ chức: Nhà gái 11:00 AM, Nhà trai 11:00 AM (giờ nhập tiệc)
const EVENT_GIRL_DATE = new Date("2025-11-06T11:00:00").getTime()
const EVENT_BOY_DATE = new Date("2025-11-11T11:00:00").getTime()

const calculateTimeLeft = (targetDate: number): TimeLeft => {
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  }
}

export default function Countdown() {
  const [addressingPair, setAddressingPair] = useState<AddressingPair>({
    self: "Chúng tôi",
    other: "Quý vị",
  })

  const [events, setEvents] = useState<WeddingEvent[]>([
    {
      id: "girl",
      title: "LỄ VU QUY - NHÀ GÁI",
      date: new Date(EVENT_GIRL_DATE),
      dateString: "Thứ 5, 06 Tháng 11, 2025",
      lunarDate: "(17/09 ÂL)",
      location: "Sầm Sơn, Thanh Hóa",
      time: "10:00 Sáng",
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    },
    {
      id: "boy",
      title: "LỄ THÀNH HÔN - NHÀ TRAI",
      date: new Date(EVENT_BOY_DATE),
      dateString: "Thứ 3, 11 Tháng 11, 2025",
      lunarDate: "(22/09 ÂL)",
      location: "Tuy An Bắc, Đắk Lắk",
      time: "10:00 Sáng",
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    },
  ])

  useEffect(() => {
    const loadAddressing = () => {
      const storedPair = localStorage.getItem(ADDRESSING_KEY)
      if (storedPair) {
        try {
          const parsedPair: AddressingPair = JSON.parse(storedPair)
          if (parsedPair.self && parsedPair.other) {
            setAddressingPair(parsedPair)
          }
        } catch (e) {
        }
      }
    }

    loadAddressing()
    window.addEventListener("addressing-updated", loadAddressing)

    const timer = setInterval(() => {
      setEvents(prevEvents => prevEvents.map(event => ({
        ...event,
        timeLeft: calculateTimeLeft(event.date.getTime()),
      })))
    }, 1000)

    return () => {
      clearInterval(timer)
      window.removeEventListener("addressing-updated", loadAddressing)
    }
  }, [])

  const renderTimeUnits = (timeLeft: TimeLeft) => {
    const timeUnits = [
      { label: "NGÀY", value: timeLeft.days },
      { label: "GIỜ", value: timeLeft.hours },
      { label: "PHÚT", value: timeLeft.minutes },
      { label: "GIÂY", value: timeLeft.seconds },
    ]

    return (
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
    )
  }

  const selfAddressing = addressingPair.self.toLocaleLowerCase("vi-VN")
  const otherAddressing = addressingPair.other

  return (
    <div className="flex min-h-full md:min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl space-y-12 text-center"
      >
        <div className="space-y-4">
          <h2 className="font-script text-5xl text-primary">Đếm Ngược</h2>
          <p className="font-serif text-lg text-muted-foreground">
            Cho đến khi <span className="text-foreground font-semibold">{selfAddressing}</span>
            <br />
            <span className={ELEGANT_STYLE}>Chính thức về chung một nhà ^^</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, eventIndex) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: eventIndex === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + eventIndex * 0.1 }}
              className="space-y-6 rounded-2xl bg-card p-6 shadow-xl border border-primary/20"
            >
              <h3 className="font-serif text-lg font-bold text-primary uppercase">{event.title}</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-foreground" />
                  <p className="text-sm font-semibold text-foreground md:text-base">
                    <span className="font-extrabold">{event.dateString}</span> {event.lunarDate}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <p className="text-sm">Bắt đầu: {event.time}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <p className="text-sm">{event.location}</p>
                </div>
              </div>

              {renderTimeUnits(event.timeLeft)}
            </motion.div>
          ))}
        </div>

        <p className="font-serif text-base text-muted-foreground pt-4">
          <span className="text-foreground font-semibold">{addressingPair.self}</span>{" "}
          <span className={""}>chân thành mong được chung vui cùng</span>{" "}
          <span className="text-foreground font-semibold">{otherAddressing}</span>!
        </p>
      </motion.div>
    </div>
  )
}