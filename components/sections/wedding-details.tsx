"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Calendar, PartyPopper } from "lucide-react"

export default function WeddingDetails() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-12"
      >
        <div className="space-y-4 text-center">
          <h2 className="font-script text-5xl text-primary">Thông Tin Đám Cưới</h2>
          <p className="font-serif text-sm text-muted-foreground">Wedding Details</p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card p-8 shadow-lg"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground">Lễ Vu Quy - Nhà Gái</h3>
            <p className="mb-4 text-sm text-muted-foreground">Bride's Family Ceremony</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">8:00 Sáng</p>
                  <p className="text-muted-foreground">23 Tháng 11, 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Nhà Gái</p>
                  <p className="text-muted-foreground">Địa chỉ nhà gái, Việt Nam</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-card p-8 shadow-lg"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground">Lễ Thành Hôn - Nhà Trai</h3>
            <p className="mb-4 text-sm text-muted-foreground">Groom's Family Ceremony</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">11:00 Sáng</p>
                  <p className="text-muted-foreground">23 Tháng 11, 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Nhà Trai</p>
                  <p className="text-muted-foreground">Địa chỉ nhà trai, Việt Nam</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 shadow-lg"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <PartyPopper className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground">Tiệc Báo Hỉ Thân Mật</h3>
            <p className="mb-4 text-sm text-muted-foreground">Intimate Celebration Party</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">6:00 Chiều</p>
                  <p className="text-muted-foreground">30 Tháng 11, 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Nhà Hàng Tiệc Cưới</p>
                  <p className="text-muted-foreground">Đà Nẵng, Việt Nam</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
