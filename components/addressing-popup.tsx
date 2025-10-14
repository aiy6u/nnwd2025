"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, LucideSettings, Music, X } from "lucide-react"

interface AddressingPair {
  self: string
  other: string
}

// Map để tự động xác định xưng hô (self) dựa trên cách gọi (other)
const SELF_CAST_MAP: { [key: string]: string } = {
  "Ông/Bà": "Chúng con",
  "Bố/Mẹ": "Chúng con",
  "Bác": "Chúng cháu",
  "Cô": "Chúng cháu",
  "Chú": "Chúng cháu",
  "Cậu": "Chúng cháu",
  "Mợ": "Chúng cháu",
  "Anh": "Chúng mình",
  "Chị": "Chúng mình",
  "Em": "Anh/Chị",
  "Cháu": "Cô/Chú",
  "Bạn": "Chúng mình",
  "Quý vị": "Chúng tôi",
}

// Xưng hô mặc định nếu không tìm thấy trong map
const DEFAULT_SELF = "Chúng tôi"
const DEFAULT_MUSIC_PREF = "true" // Mặc định là Có

const otherAddressingOptions = [
  { value: "", label: "Bạn là ai...?" },
  { value: "Ông/Bà", label: "Ông/Bà" },
  { value: "Bố/Mẹ", label: "Bố/Mẹ" },
  { value: "Bác", label: "Bác" },
  { value: "Cô", label: "Cô" },
  { value: "Chú", label: "Chú" },
  { value: "Cậu", label: "Cậu" },
  { value: "Mợ", label: "Mợ" },
  { value: "Anh", label: "Anh" },
  { value: "Chị", label: "Chị" },
  { value: "Em", label: "Em" },
  { value: "Cháu", label: "Cháu" },
  { value: "Bạn", label: "Bạn" },
  { value: "Quý vị", label: "Quý vị" },
]

const ADDRESSING_KEY = "wedding-addressing-pair"
const MUSIC_PREF_KEY = "wedding-music-preference"

export default function AddressingPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [showReopenButton, setShowReopenButton] = useState(false)
  const [addressingPair, setAddressingPair] = useState<AddressingPair>({ self: "", other: "" })
  const [musicPreference, setMusicPreference] = useState(DEFAULT_MUSIC_PREF)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const storedPair = localStorage.getItem(ADDRESSING_KEY)
    const storedMusicPref = localStorage.getItem(MUSIC_PREF_KEY)

    if (storedPair) {
      try {
        const parsedPair: AddressingPair = JSON.parse(storedPair)
        if (parsedPair.self && parsedPair.other) {
          setAddressingPair(parsedPair)
          setMusicPreference(storedMusicPref || DEFAULT_MUSIC_PREF)
          setIsOpen(false)
          setShowReopenButton(true)
          return
        }
      } catch (e) {
      }
    }
    setIsOpen(true)
  }, [])

  const castSelfFromOther = (otherValue: string): string => {
    return SELF_CAST_MAP[otherValue] || DEFAULT_SELF
  }

  const handleSelectOther = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const otherValue = e.target.value
    const selfValue = castSelfFromOther(otherValue)
    setAddressingPair({ other: otherValue, self: selfValue })
  }

  const handleMusicPrefChange = (pref: string) => {
    setMusicPreference(pref)
  }

  const handleSave = () => {
    if (addressingPair.self.trim() && addressingPair.other.trim()) {
      setIsSaving(true)
      try {
        const dataToSave: AddressingPair = {
          self: addressingPair.self.trim(),
          other: addressingPair.other.trim(),
        }
        localStorage.setItem(ADDRESSING_KEY, JSON.stringify(dataToSave))
        localStorage.setItem(MUSIC_PREF_KEY, musicPreference)

        window.dispatchEvent(new Event("addressing-updated"))
        window.dispatchEvent(new Event("music-preference-updated"))

        setIsOpen(false)
        setShowReopenButton(true)
      } catch (e) {
      } finally {
        setIsSaving(false)
      }
    }
  }

  const isFormValid = addressingPair.other.trim() && musicPreference.trim()

  return (
    <>
      {showReopenButton && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/50 transition-all shadow-lg"
          aria-label="Thay đổi cài đặt"
        >
          <LucideSettings className="h-5 w-5 text-primary animate-spin" style={{
            animationDuration: '4s'
          }} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center bg-foreground/80 p-4 backdrop-blur-sm overflow-y-auto py-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-background p-8 shadow-2xl my-auto"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="mb-6 text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 fill-primary text-primary" />
                <h2 className="mb-2 font-script text-3xl text-primary">Cài Đặt Cá Nhân</h2>
                <p className="text-sm text-muted-foreground">Thiết lập trải nghiệm xem thiệp của bạn.</p>
              </div>

              <div className="space-y-6">
                {/* Gọi đối phương (other) và tự cast self */}
                <div>
                  <label htmlFor="other-addressing" className="mb-2 block text-base font-semibold text-foreground">
                    Chúng tôi gọi bạn là...?
                  </label>
                  <select
                    id="other-addressing"
                    value={addressingPair.other}
                    onChange={handleSelectOther}
                    className="w-full rounded-xl border-2 border-input bg-background p-3 text-base text-foreground focus:border-primary focus:outline-none"
                  >
                    {otherAddressingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {addressingPair.other && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Bạn chọn <span className="font-bold underline">{addressingPair.other}</span>, chúng tôi sẽ xưng: <span className="font-bold underline text-pink-700">{addressingPair.self}</span>
                    </p>
                  )}
                </div>

                {/* Chọn nghe nhạc */}
                <div>
                  <h3 className="mb-3 text-base font-semibold text-foreground flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" /> Bạn có muốn nghe nhạc không?
                  </h3>
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => handleMusicPrefChange("true")}
                      variant={musicPreference === "true" ? "default" : "outline"}
                      className={`flex-1 rounded-xl text-lg ${musicPreference === "true" ? "bg-primary text-primary-foreground" : "hover:border-primary"}`}
                    >
                      Có
                    </Button>
                    <Button
                      onClick={() => handleMusicPrefChange("false")}
                      variant={musicPreference === "false" ? "default" : "outline"}
                      className={`flex-1 rounded-xl text-lg ${musicPreference === "false" ? "bg-primary text-primary-foreground" : "hover:border-primary"}`}
                    >
                      Không
                    </Button>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full rounded-2xl" disabled={!isFormValid || isSaving}>
                  {isSaving ? "Đang lưu..." : "Xác nhận và tiếp tục"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}