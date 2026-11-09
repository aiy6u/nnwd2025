"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Heart, PartyPopper } from "lucide-react"
import Image from "next/image"

// Một năm nhìn lại: ba cột mốc của đám cưới năm 2025
const MILESTONES = [
  {
    icon: Calendar,
    title: "Lễ Vu Quy",
    date: "Thứ 5, 06/11/2025",
    lunar: "17/09 Âm lịch",
    place: "Nhà hàng Sơn Hà, Sầm Sơn, Thanh Hóa",
    note: "Em khoác áo cưới, khẽ chào bố mẹ rồi nắm tay Anh bước ra từ mái nhà thân thương. Những giọt nước mắt hôm ấy là hạnh phúc.",
    photo: "/gallery/anniversary/vu-quy-DSC01042.jpg",
  },
  {
    icon: Heart,
    title: "Lễ Tân Hôn",
    date: "Thứ 3, 11/11/2025",
    lunar: "22/09 Âm lịch",
    place: "Nhà hàng 464, Tuy An Bắc, Đắk Lắk",
    note: "Trước gia tiên và họ hàng hai bên, hai ta chính thức nên duyên vợ chồng. Từ đây, nhà mình có thêm một người để thương.",
    photo: "/gallery/anniversary/tan-hon-KHA04124.jpg",
  },
  {
    icon: PartyPopper,
    title: "Tiệc Báo Hỷ",
    date: "Thứ 7, 15/11/2025",
    lunar: "26/09 Âm lịch",
    place: "Nhà hàng Mộc Mây, Hải Châu, Đà Nẵng",
    note: "Một buổi tiệc ấm áp bên bạn bè, đồng nghiệp ở Đà Nẵng, nơi những tràng cười và lời chúc làm ngày vui thêm trọn.",
    photo: "/gallery/anniversary/bao-hy-20251115_123619_456.jpg",
  },
]

export default function WeddingDetails() {
  return (
    <div className="flex min-h-full md:min-h-screen flex-col items-center justify-center px-6 py-20 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl space-y-12"
      >
        <div className="space-y-4 text-center">
          <h2 className="font-script text-4xl text-primary md:text-6xl lg:text-7xl">Những Mốc Son Ngày Cưới</h2>
          <p className="mx-auto max-w-xl font-serif text-base italic text-muted-foreground md:text-lg">Tháng Mười Một năm ấy, ba ngày vui nối nhau thành một chuyện tình trọn vẹn</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="overflow-hidden rounded-2xl bg-card shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-white/85 px-3 py-1 font-serif text-xs font-semibold text-primary shadow">Mốc {i + 1}</span>
                <Image
                  src={m.photo}
                  alt={m.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-[50%_12%] transition-transform duration-[1500ms] hover:scale-110"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <m.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg font-semibold text-foreground">{m.title}</h3>
                </div>
                <p className="font-serif text-sm font-medium text-foreground">
                  {m.date} <span className="text-muted-foreground">({m.lunar})</span>
                </p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {m.place}
                </p>
                <p className="font-serif text-sm italic text-foreground/80">{m.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
