"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

interface AddressingPair {
  self: string
  other: string
}
const ADDRESSING_KEY = "wedding-addressing-pair"

const photos = [
  {
    url: "/gallery/DSC00327.jpg",
    alt: "Cô dâu chú rể rạng rỡ hạnh phúc trong tà áo dài đỏ truyền thống!",
    width: 600,
    height: 800,
  },
  {
    url: "/gallery/DSC00395.jpg",
    alt: "Cặp đôi ngọt ngào tạo dáng trong studio với chữ Song Hỷ may mắn!",
    width: 800,
    height: 600,
  },
  {
    url: "/gallery/DSC00454.jpg",
    alt: "Anh và Em thật thanh lịch, sang trọng trong trang phục cưới trắng tinh khôi!",
    width: 600,
    height: 800,
  },
  {
    url: "/gallery/DSC00575.jpg",
    alt: "Ảnh cưới toàn thân siêu lãng mạn của đôi uyên ương trong bộ trắng!",
    width: 600,
    height: 800,
  },
  {
    url: "/gallery/DSC00682.jpg",
    alt: "Em ngồi duyên dáng, Anh đứng kề bên trong trang phục cưới trắng tinh khôi!",
    width: 800,
    height: 600,
  },
  {
    url: "/gallery/DSC00687.jpg",
    alt: "Khoảnh khắc cận cảnh tình tứ của Anh vest đen, Em váy trắng!",
    width: 800,
    height: 600,
  },
  {
    url: "/gallery/DSC00714.jpg",
    alt: "Cặp đôi say đắm trong váy cưới trắng và vest trắng đầy tình cảm!",
    width: 800,
    height: 600,
  },
  {
    url: "/gallery/DSC00748.jpg",
    alt: "Ảnh cưới toàn thân lung linh của Em và Anh trong váy áo trắng!",
    width: 600,
    height: 800,
  },
  {
    url: "/gallery/DSC00828.jpg",
    alt: "Cô dâu chú rể với nụ cười hạnh phúc, áo dài đỏ thắm tình!",
    width: 800,
    height: 600,
  },
  {
    url: "/gallery/DSC00855.jpg",
    alt: "Khoảnh khắc cưới cổ điển, sang trọng, tràn đầy yêu thương của hai ta!",
    width: 600,
    height: 800,
  },
  {
    url: "/gallery/DSC00941.jpg",
    alt: "Một bức ảnh cưới độc đáo và đầy nghệ thuật của đôi mình!",
    width: 800,
    height: 600,
  },
  {
    url: "/gallery/DSC00948.jpg",
    alt: "Bức ảnh cưới ấn tượng, ghi lại kỷ niệm đẹp nhất của hai trái tim!",
    width: 800,
    height: 600,
  },
]

export default function Gallery() {
  const isMobile = useIsMobile()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selfAddressing, setSelfAddressing] = useState("Chúng tôi")

  useEffect(() => {
    const loadAddressing = () => {
      const storedPair = localStorage.getItem(ADDRESSING_KEY)
      if (storedPair) {
        try {
          const parsedPair: AddressingPair = JSON.parse(storedPair)
          if (parsedPair.self) {
            setSelfAddressing(parsedPair.self)
          }
        } catch (e) { /* handle error */ }
      }
    }

    loadAddressing()
    window.addEventListener("addressing-updated", loadAddressing)

    return () => window.removeEventListener("addressing-updated", loadAddressing)
  }, [])

  const navigate = (direction: number) => {
    if (selectedImage === null) return
    const newIndex = (selectedImage + direction + photos.length) % photos.length
    setSelectedImage(newIndex)
  }

  const currentPhoto = selectedImage !== null ? photos[selectedImage] : null

  return (
    <div className="flex min-h-full md:min-h-screen flex-col items-center justify-center px-6 py-20 md:px-12">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("w-full max-w-6xl space-y-12", selectedImage !== null && isMobile ? "hidden" : "")}
      >
        <div className="space-y-4 text-center">
          <h2 className="font-script text-4xl text-primary md:text-6xl lg:text-7xl">
            Khoảnh Khắc Của {selfAddressing}
          </h2>
          <p className="font-serif text-xs text-muted-foreground md:text-sm">Our Gallery</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6">
          {photos.map((photo, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedImage(index)}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted shadow-lg transition-transform hover:scale-105 md:rounded-2xl"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="h-full w-full object-cover absolute inset-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/10" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImage !== null && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 top-4 text-background hover:bg-background/10 md:right-8 md:top-8"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6 md:h-8 md:w-8" />
            </Button>



            <motion.div
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              // Giữ lại các lớp làm tròn góc
              className="relative w-full h-full max-h-[85vh] max-w-full overflow-hidden md:max-h-[90vh] content-center justify-items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image fill sẽ lấp đầy container có góc tròn */}
              <Image
                src={currentPhoto.url}
                className={cn("rounded-xl md:rounded-2xl max-h-full max-w-full w-fit h-fit object-contain", !isMobile ? "" : "")}
                alt={currentPhoto.alt}
                width={currentPhoto.width}
                height={currentPhoto.height}
                priority={true}
              />
            </motion.div>

            {/* Đảm bảo nút Prev có border tròn và hiệu ứng */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-4 text-background hover:bg-background/10 md:left-8 md:h-16 md:w-16 border border-pink-800 rounded-full animate-pulse bg-pink-500/50 z-0"
              onClick={(e) => {
                e.stopPropagation()
                navigate(-1)
              }}
            >
              <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
            </Button>

            {/* Đảm bảo nút Next có border tròn và hiệu ứng */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 text-background hover:bg-background/10 md:right-8 md:h-16 md:w-16 border border-pink-800 rounded-full animate-pulse bg-pink-500/50"
              onClick={(e) => {
                e.stopPropagation()
                navigate(1)
              }}
            >
              <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}