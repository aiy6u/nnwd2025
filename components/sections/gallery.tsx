"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddressingPair {
  self: string;
  other: string;
}
const ADDRESSING_KEY = "wedding-addressing-pair";

const photos = [
  {
    url: "/romantic-couple-portrait-at-sunset.jpg",
    alt: "Ảnh cặp đôi lúc hoàng hôn",
  },
  {
    url: "/couple-holding-hands-in-nature.jpg",
    alt: "Nắm tay nhau trong thiên nhiên",
  },
  {
    url: "/couple-laughing.png",
    alt: "Cười đùa cùng nhau",
  },
  {
    url: "/romantic-couple-by-the-beach.jpg",
    alt: "Bên bờ biển",
  },
  {
    url: "/couple-in-elegant-attire.jpg",
    alt: "Trang phục lịch lãm",
  },
  {
    url: "/couple-with-flowers.jpg",
    alt: "Cùng hoa",
  },
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selfAddressing, setSelfAddressing] = useState("Chúng tôi");

  useEffect(() => {
    const storedPair = localStorage.getItem(ADDRESSING_KEY);
    if (storedPair) {
      try {
        const parsedPair: AddressingPair = JSON.parse(storedPair);
        if (parsedPair.self) {
          setSelfAddressing(parsedPair.self);
        }
      } catch (e) {
      }
    }
  }, [])

  const navigate = (direction: number) => {
    if (selectedImage === null) return
    const newIndex = (selectedImage + direction + photos.length) % photos.length
    setSelectedImage(newIndex)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl space-y-12"
      >
        <div className="space-y-4 text-center">
          {/* Sử dụng selfAddressing đã lấy từ localStorage */}
          <h2 className="font-script text-5xl text-primary">Khoảnh Khắc Của {selfAddressing}</h2>
          <p className="font-serif text-sm text-muted-foreground">Our Gallery</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedImage(index)}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-lg transition-transform hover:scale-105"
            >
              <img src={photo.url || "/placeholder.svg"} alt={photo.alt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/10" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 top-4 text-background hover:bg-background/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute left-4 text-background hover:bg-background/10"
              onClick={(e) => {
                e.stopPropagation()
                navigate(-1)
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <motion.img
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={photos[selectedImage].url}
              alt={photos[selectedImage].alt}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-background hover:bg-background/10"
              onClick={(e) => {
                e.stopPropagation()
                navigate(1)
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}