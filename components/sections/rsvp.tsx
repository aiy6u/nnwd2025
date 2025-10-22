"use client"

import type React from "react"

import { useState, useEffect, type ChangeEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

type Step = "form" | "thankyou"

interface AddressingPair {
  self: string
  other: string
}
const ADDRESSING_KEY = "wedding-addressing-pair"

// Thêm "Cậu", "Mợ" vào nhóm vai vế gia đình để loại trừ tiệc Đà Nẵng
const FAMILY_ROLES = ["Ông/Bà", "Bố/Mẹ", "Cô", "Chú", "Bác", "Cậu", "Mợ"]

export default function RSVP() {
  const [step, setStep] = useState<Step>("form")
  const [formData, setFormData] = useState({
    name: "",
    phone: "", // Đã thay email bằng phone
    locations: [] as string[],
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [addressingPair, setAddressingPair] = useState<AddressingPair>({
    self: "Chúng tôi",
    other: "Quý vị",
  })

  useEffect(() => {
    const loadAddressing = () => {
      const storedPair = localStorage.getItem(ADDRESSING_KEY)
      if (storedPair) {
        try {
          const parsedPair: AddressingPair = JSON.parse(storedPair)
          if (parsedPair.self && parsedPair.other) {
            setAddressingPair(parsedPair)
          }
        } catch (e) { }
      }
    }

    loadAddressing()
    window.addEventListener("addressing-updated", loadAddressing)

    return () => window.removeEventListener("addressing-updated", loadAddressing)
  }, [])

  const selfAddressing = addressingPair.self
  const otherAddressing = addressingPair.other

  // Logic: Ẩn tiệc Đà Nẵng nếu khách thuộc nhóm vai vế gia đình
  const isFamilyMember = FAMILY_ROLES.includes(otherAddressing)

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, locations: [...formData.locations, location] })
    } else {
      setFormData({ ...formData, locations: formData.locations.filter((l) => l !== location) })
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Lưu lời nhắn vào Local Storage (giữ nguyên logic)
      if (formData.message.trim()) {
        const existingMessages = localStorage.getItem("wedding-messages")
        const messages = existingMessages ? JSON.parse(existingMessages) : []
        messages.push({
          name: formData.name,
          message: formData.message,
          timestamp: Date.now(),
        })
        localStorage.setItem("wedding-messages", JSON.stringify(messages))
        window.dispatchEvent(new Event("messages-updated"))
      }

      // 2. Gọi API để đẩy data vào Google Sheet
      const response = await fetch("/api/send-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("API call failed")
      }

      toast({
        title: `Cảm ơn ${otherAddressing}`,
        description: `${selfAddressing} đã nhận được phản hồi của ${otherAddressing}.`,
      })

      setStep("thankyou")
    } catch (error) {
      console.error(error)
      toast({
        title: "Lỗi",
        description: "Không thể gửi. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === "thankyou") {
    const hasAttendance = formData.locations.length > 0

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl space-y-8 text-center"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
            >
              <svg className="h-12 w-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="font-script text-5xl text-primary">Cảm Ơn {otherAddressing}!</h2>
            <p className="font-serif text-2xl text-foreground">Xác nhận thành công!</p>
            {hasAttendance ? (
              <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
                {selfAddressing} đã nhận được xác nhận của {otherAddressing}. Rất mong được gặp {otherAddressing} tại
                buổi tiệc!
              </p>
            ) : ((formData.message.length > 0 ?
              <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
                {selfAddressing} đã nhận được lời chúc từ {otherAddressing}. {selfAddressing} cảm ơn rất nhiều!
              </p> :
              <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
                Cảm ơn {otherAddressing} đã quan tâm và ghé qua.
              </p>
            )
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full md:min-h-screen flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-12"
      >
        <div className="space-y-4 text-center">
          <h2 className="font-script text-5xl text-primary">Xác Nhận Tham Dự</h2>
          <p className="font-serif text-sm text-muted-foreground">RSVP</p>
          <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
            Vui lòng cho {selfAddressing} biết {otherAddressing} có thể tham dự không
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-card p-8 shadow-lg"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="font-serif text-foreground">
              Tên của {otherAddressing}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="border-border bg-background"
              placeholder={'Nhập tên ' + otherAddressing.toLocaleLowerCase()}
            />
          </div>

          {/* Đã thay trường Email bằng Số điện thoại */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-serif text-foreground">
              Số điện thoại của {otherAddressing} (không bắt buộc)
            </Label>
            <Input
              id="phone"
              type="tel" // Dùng type="tel" cho mobile
              value={formData.phone}
              onChange={handleInputChange}
              className="border-border bg-background"
              placeholder="09xx xxx xxx"
            />
          </div>

          <div className="space-y-3">
            <Label className="font-serif text-foreground">{otherAddressing} sẽ tham dự ở đâu?</Label>
            <div className="space-y-3 rounded-lg bg-background/50 p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="nha-gai"
                  checked={formData.locations.includes("nha-gai")}
                  onCheckedChange={(checked) => handleLocationChange("nha-gai", checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="nha-gai" className="font-normal leading-none cursor-pointer">
                    Lễ Vu Quy - Nhà Gái
                  </Label>
                  <p className="text-xs text-muted-foreground">10h00 - Thứ 5, 06/11/2025</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="nha-trai"
                  checked={formData.locations.includes("nha-trai")}
                  onCheckedChange={(checked) => handleLocationChange("nha-trai", checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="nha-trai" className="font-normal leading-none cursor-pointer">
                    Lễ Thành Hôn - Nhà Trai
                  </Label>
                  <p className="text-xs text-muted-foreground">10h00 - Thứ 3, 11/11/2025</p>
                </div>
              </div>

              {/* Logic ẩn hiện Tiệc Báo Hỉ Đà Nẵng */}
              {!isFamilyMember && (
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="da-nang"
                    checked={formData.locations.includes("da-nang")}
                    onCheckedChange={(checked) => handleLocationChange("da-nang", checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="da-nang" className="font-normal leading-none cursor-pointer">
                      Tiệc Báo Hỉ - Đà Nẵng
                    </Label>
                    <p className="text-xs text-muted-foreground">18h00 - Thứ 7, 15/11/2025</p>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  Không chọn địa điểm nào đồng nghĩa với việc {otherAddressing} không thể đến nhưng vẫn gửi lời chúc phúc ❤️
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="font-serif text-foreground">
              Lời nhắn cho cô dâu chú rể
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="border-border bg-background"
              placeholder={`Gửi lời chúc của ${otherAddressing} tới ${selfAddressing}...`}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary py-6 font-serif text-lg text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Đang gửi xác nhận..." : "Gửi xác nhận"}
          </Button>
        </motion.form>
      </motion.div>
    </div>
  )
}