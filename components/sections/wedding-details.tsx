"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Calendar, PartyPopper, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const ADDRESSING_KEY = "wedding-addressing-pair"

interface AddressingPair {
  self: string
  other: string
}

const FAMILY_ROLES = ["Ông/Bà", "Bố/Mẹ", "Bác", "Cô", "Chú", "Cậu", "Mợ"]

export default function WeddingDetails() {
  const brideLocationUrl = "https://maps.app.goo.gl/fr9DER8CmdWD3ceWA"
  const groomLocationUrl = "https://maps.app.goo.gl/8kJatofogLNXbWUW8"
  const daNangLocationUrl = "https://maps.app.goo.gl/o7n3bZ5Gs9vvKebs5"

  const [showDaNangParty, setShowDaNangParty] = useState(true)

  useEffect(() => {
    const loadAddressing = () => {
      const storedPair = localStorage.getItem(ADDRESSING_KEY)
      if (storedPair) {
        try {
          const parsedPair: AddressingPair = JSON.parse(storedPair)
          const role = parsedPair.other

          // Ẩn tiệc Đà Nẵng nếu khách thuộc nhóm vai vế gia đình
          setShowDaNangParty(!FAMILY_ROLES.includes(role))
        } catch (e) {
          // Mặc định là hiển thị nếu có lỗi
          setShowDaNangParty(true)
        }
      } else {
        // Mặc định là hiển thị nếu chưa chọn
        setShowDaNangParty(true)
      }
    }

    loadAddressing()
    window.addEventListener("addressing-updated", loadAddressing)
    return () => window.removeEventListener("addressing-updated", loadAddressing)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-12 md:space-y-16"
      >
        <div className="space-y-4 text-center">
          <h2 className="font-script text-4xl text-primary md:text-6xl lg:text-7xl">Thông Tin Đám Cưới</h2>
          <p className="font-serif text-xs text-muted-foreground md:text-sm">Wedding Details</p>
        </div>

        <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card p-6 shadow-lg md:p-8 lg:p-10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 md:h-16 md:w-16">
              <Calendar className="h-7 w-7 text-primary md:h-8 md:w-8" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-semibold text-foreground md:text-2xl">Lễ Vu Quy - Nhà Gái</h3>
            <p className="mb-4 text-xs text-muted-foreground md:text-sm">Bride's Family Ceremony</p>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-primary md:h-5 md:w-5" />
                <div>
                  <p className="font-serif font-medium text-foreground">10h00 - Thứ 5, 06 Tháng 11, 2025</p>
                  <p className="text-muted-foreground">Nhằm ngày 17 tháng 9 Âm lịch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary md:h-5 md:w-5" />
                <div className="flex-1">
                  <p className="font-serif font-medium text-foreground">Nhà hàng Sơn Hà</p>
                  <p className="text-muted-foreground">20 Nguyễn Du, P. Trường Sơn, Sầm Sơn, Thanh Hóa</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-transparent"
                onClick={() => window.open(brideLocationUrl, "_blank")}
              >
                <MapPin className="h-3 w-3 mr-2" />
                Xem bản đồ
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-card p-6 shadow-lg md:p-8 lg:p-10"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 md:h-16 md:w-16">
              <Calendar className="h-7 w-7 text-primary md:h-8 md:w-8" />
            </div>
            <h3 className="mb-2 font-serif text-xl font-semibold text-foreground md:text-2xl">
              Lễ Thành Hôn - Nhà Trai
            </h3>
            <p className="mb-4 text-xs text-muted-foreground md:text-sm">Groom's Family Ceremony</p>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-primary md:h-5 md:w-5" />
                <div>
                  <p className="font-serif font-medium text-foreground">10h00 - Thứ 3, 11 Tháng 11, 2025</p>
                  <p className="text-muted-foreground">Nhằm ngày 22 tháng 9 Âm lịch</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary md:h-5 md:w-5" />
                <div className="flex-1">
                  <p className="font-serif font-medium text-foreground">Trung tâm tiệc cưới Nhà Hàng 464</p>
                  <p className="text-muted-foreground line-clamp-2">KP. Trường Xuân, Xã Tuy An Bắc, tỉnh Đắk Lắk</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-transparent"
                onClick={() => window.open(groomLocationUrl, "_blank")}
              >
                <MapPin className="h-3 w-3 mr-2" />
                Xem bản đồ
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Tiệc Báo Hỉ tại Đà Nẵng, chỉ hiển thị nếu showDaNangParty là true */}
          {showDaNangParty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl bg-gradient-to-r from-violet-200 to-pink-200 p-1 shadow-lg md:col-span-2"
            >
              <div className="rounded-2xl bg-card p-6 md:p-8 lg:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 md:h-16 md:w-16">
                  <PartyPopper className="h-7 w-7 text-primary md:h-8 md:w-8" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground md:text-2xl">Tiệc Báo Hỉ Thân Mật</h3>
                <p className="mb-4 text-xs text-muted-foreground md:text-sm">Intimate Celebration Party</p>
                <div className="space-y-3 text-sm md:text-base">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-primary md:h-5 md:w-5" />
                    <div>
                      <p className="font-serif font-medium text-foreground">11h00 - Thứ 7, ngày 15 tháng 11, 2025</p>
                      <p className="text-muted-foreground">Nhằm ngày 26 tháng 9 Âm lịch</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary md:h-5 md:w-5" />
                    <div className="flex-1">
                      <p className="font-serif font-medium text-foreground">Nhà hàng MỘC MÂY</p>
                      <p className="text-muted-foreground">Lô 01 A3-5 Khu Biệt Thự Đảo Xanh - Quận Hải Châu - TP Đà Nẵng</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-gradient-to-r from-violet-200 to-pink-200 text-pink-800"
                    onClick={() => window.open(daNangLocationUrl, "_blank")}
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    Xem bản đồ
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}