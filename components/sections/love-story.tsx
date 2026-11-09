"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Gem, HandHeart, Heart, Route, Sparkles, Home } from "lucide-react"

interface AddressingPair {
  self: string
  other: string
}
const ADDRESSING_KEY = "wedding-addressing-pair"

// Đường cong uốn lượn nối các mốc, vẽ dần khi vào trang
const ROW = 170
function wavePath(n: number) {
  let d = `M 50 0`
  for (let i = 0; i < n; i++) {
    const y0 = i * ROW
    const y1 = y0 + ROW
    const dir = i % 2 === 0 ? 1 : -1
    d += ` C ${50 + dir * 38} ${y0 + ROW * 0.35}, ${50 + dir * 38} ${y0 + ROW * 0.65}, 50 ${y1}`
  }
  return d
}

export default function LoveStory() {
  const [pair, setPair] = useState<AddressingPair>({ self: "Chúng tôi", other: "Quý vị" })

  useEffect(() => {
    const load = () => {
      try {
        const p: AddressingPair = JSON.parse(localStorage.getItem(ADDRESSING_KEY) || "{}")
        if (p.self && p.other) setPair(p)
      } catch (e) {}
    }
    load()
    window.addEventListener("addressing-updated", load)
    return () => window.removeEventListener("addressing-updated", load)
  }, [])

  const self = pair.self
  const Self = self.charAt(0).toLocaleUpperCase("vi-VN") + self.slice(1)

  const timeline = [
    { icon: Sparkles, title: "Gặp Gỡ Lần Đầu", date: "08.2018", description: "Một buổi lễ vinh danh tình cờ, một ánh nhìn chạm nhau, và điều kỳ diệu bắt đầu từ đó." },
    { icon: Heart, title: "Lời Tỏ Tình", date: "02.06.2019", description: `Sóng biển Nha Trang làm chứng cho lời thương đầu tiên, mở ra câu chuyện của ${self}.` },
    { icon: Route, title: "Hành Trình Yêu Thương", date: "2020 – 2025", description: `Năm năm cùng đi qua nắng mưa, xa cách và đợi chờ, để ${self} hiểu nhau và lớn lên cùng nhau.` },
    { icon: HandHeart, title: "Lời Cầu Hôn", date: "05.10.2025", description: "Anh ngỏ lời, Em gật đầu. Một chương mới của cuộc đời chính thức được viết." },
    { icon: Gem, title: "Về Chung Một Nhà", date: "11.11.2025", description: `${Self} nên duyên vợ chồng trong niềm vui và lời chúc phúc của ${pair.other}.` },
    { icon: Home, title: "Tròn Một Năm", date: "11.11.2026", description: `Một năm chung mái nhà, ${self} vẫn đang cùng nhau vun đắp từng ngày bình yên.` },
  ]

  const height = timeline.length * ROW

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-20 md:min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl space-y-12">
        <div className="space-y-3 text-center">
          <h2 className="font-script text-5xl text-primary md:text-7xl">Câu Chuyện Tình Yêu</h2>
          <p className="font-serif text-base italic text-muted-foreground md:text-lg">Bảy năm, một con đường, hai trái tim</p>
        </div>

        <div className="relative mx-auto w-full" style={{ height }}>
          {/* Đường đi */}
          <svg
            className="pointer-events-none absolute left-0 top-0 h-full w-full"
            viewBox={`0 0 100 ${height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="loveGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={height}>
                <stop offset="0%" stopColor="#ef8fa8" />
                <stop offset="50%" stopColor="#e88aa2" />
                <stop offset="100%" stopColor="#e07a96" />
              </linearGradient>
            </defs>
            <path d={wavePath(timeline.length)} fill="none" stroke="currentColor" className="text-primary/15" strokeWidth={6} vectorEffect="non-scaling-stroke" />
            <clipPath id="loveReveal">
              <motion.rect
                x="0"
                y="0"
                width="100"
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 3.2, ease: "easeInOut", delay: 0.3 }}
              />
            </clipPath>
            <path
              d={wavePath(timeline.length)}
              fill="none"
              stroke="url(#loveGrad)"
              strokeWidth={3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              clipPath="url(#loveReveal)"
            />
          </svg>

          {timeline.map((item, i) => {
            const Icon = item.icon
            const left = i % 2 === 0
            const top = i * ROW + ROW / 2
            return (
              <div key={item.title} className="absolute left-0 right-0" style={{ top, transform: "translateY(-50%)" }}>
                {/* Nút mốc trên đường */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.5 + i * 0.5 }}
                  className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${left ? 50 + 28 : 50 - 28}%` }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-pink-400 shadow-lg ring-4 ring-background md:h-14 md:w-14">
                    <Icon className="h-5 w-5 text-white md:h-6 md:w-6" />
                  </span>
                </motion.div>

                {/* Thẻ nội dung nằm phía đối diện */}
                <motion.div
                  initial={{ opacity: 0, x: left ? -40 : 40, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.7 + i * 0.5 }}
                  className={`absolute top-1/2 w-[58%] -translate-y-1/2 md:w-[44%] ${left ? "left-0 text-right" : "right-0 text-left"}`}
                >
                  <div className="rounded-2xl border border-primary/10 bg-card/90 p-3 shadow-lg backdrop-blur md:p-5">
                    <p className="font-serif text-sm font-semibold tracking-widest text-amber-600">{item.date}</p>
                    <h3 className="font-serif text-lg font-bold text-foreground md:text-2xl">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-foreground/75 md:text-sm">{item.description}</p>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
