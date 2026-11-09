"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Slideshow from "yet-another-react-lightbox/plugins/slideshow"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import { Expand, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { anniversaryPhotos, type AnniversaryPhoto, type PhotoEvent } from "@/lib/anniversary-photos"

interface AddressingPair {
  self: string
  other: string
}
const ADDRESSING_KEY = "wedding-addressing-pair"

// Ảnh studio trước cưới (đã bỏ 2 tấm gần trùng DSC00395, DSC00948)
const studioPhotos: AnniversaryPhoto[] = [
  { url: "/gallery/DSC00327.jpg", alt: "Ảnh cưới studio, vest đen váy trắng", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00454.jpg", alt: "Ảnh cưới studio, cận cảnh hai người", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00575.jpg", alt: "Ảnh cưới studio, ánh sáng huyền ảo", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00682.jpg", alt: "Ảnh cưới studio, vest trắng", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00687.jpg", alt: "Ảnh cưới studio, khung cảnh cổ điển", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00714.jpg", alt: "Ảnh cưới studio, phòng tân cổ điển", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00748.jpg", alt: "Ảnh cưới studio, Em ngồi Anh đứng", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00828.jpg", alt: "Ảnh cưới studio, áo dài đỏ", width: 2000, height: 1333, event: "studio" },
  { url: "/gallery/DSC00855.jpg", alt: "Ảnh cưới studio, áo dài đỏ và chữ Hỷ", width: 1333, height: 2000, event: "studio" },
  { url: "/gallery/DSC00941.jpg", alt: "Ảnh cưới studio, áo dài đỏ và quạt", width: 1333, height: 2000, event: "studio" },
]

const EVENT_ORDER: PhotoEvent[] = ["studio", "vu-quy", "tan-hon", "bao-hy"]
const FILTERS: { id: "all" | PhotoEvent; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "studio", label: "Ảnh cưới" },
  { id: "vu-quy", label: "Vu Quy 06.11" },
  { id: "tan-hon", label: "Tân Hôn 11.11" },
  { id: "bao-hy", label: "Báo Hỷ 15.11" },
]
const EVENT_LABEL: Record<PhotoEvent, string> = {
  studio: "Ảnh cưới",
  "vu-quy": "Lễ Vu Quy",
  "tan-hon": "Lễ Tân Hôn",
  "bao-hy": "Tiệc Báo Hỷ",
}

const allPhotos = [...studioPhotos, ...anniversaryPhotos].sort(
  (x, y) => EVENT_ORDER.indexOf(x.event) - EVENT_ORDER.indexOf(y.event),
)

function Tile({ photo, index, onOpen }: { photo: AnniversaryPhoto; index: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 40, scale: 0.92, rotate: index % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: (index % 4) * 0.06 }}
      onClick={onOpen}
      className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-primary/10 md:mb-4"
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <div className={cn("absolute inset-0 skeleton transition-opacity duration-700", loaded ? "opacity-0" : "opacity-100")} />
      <Image
        src={photo.url}
        alt={photo.alt}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className={cn(
          "object-cover transition-all duration-[1200ms] ease-out group-hover:scale-110",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
        )}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      {/* Lớp phủ khi rê chuột */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* Vệt sáng lướt qua */}
      <div className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 group-hover:left-[150%]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex translate-y-4 items-center justify-between p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="font-serif text-sm italic text-white drop-shadow">{EVENT_LABEL[photo.event]}</span>
        <Expand className="h-4 w-4 text-white" />
      </div>
    </motion.button>
  )
}

export default function Gallery() {
  const [selfAddressing, setSelfAddressing] = useState("Chúng tôi")
  const [filter, setFilter] = useState<"all" | PhotoEvent>("all")
  const [openIndex, setOpenIndex] = useState(-1)

  useEffect(() => {
    const load = () => {
      try {
        const pair: AddressingPair = JSON.parse(localStorage.getItem(ADDRESSING_KEY) || "{}")
        if (pair.self) setSelfAddressing(pair.self)
      } catch (e) {}
    }
    load()
    window.addEventListener("addressing-updated", load)
    return () => window.removeEventListener("addressing-updated", load)
  }, [])

  const photos = useMemo(() => (filter === "all" ? allPhotos : allPhotos.filter((p) => p.event === filter)), [filter])
  const slides = useMemo(
    () => photos.map((p) => ({ src: p.url as string, alt: p.alt, width: p.width, height: p.height, description: p.alt })),
    [photos],
  )

  return (
    <div className="relative flex min-h-full flex-col items-center px-4 py-20 md:min-h-screen md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl space-y-10"
      >
        <div className="space-y-3 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/15"
          >
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>
          <h2 className="font-script text-5xl text-primary md:text-7xl">Khoảnh Khắc Của {selfAddressing}</h2>
          <p className="font-serif text-base italic text-muted-foreground md:text-lg">
            {allPhotos.length} khung hình, một năm thương nhớ
          </p>
        </div>

        {/* Bộ lọc, viên chọn trượt mượt giữa các mục */}
        <div className="flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative rounded-full px-4 py-1.5 font-serif text-sm transition-colors md:text-base",
                filter === f.id ? "text-primary-foreground" : "text-foreground hover:text-primary",
              )}
            >
              {filter === f.id && (
                <motion.span
                  layoutId="gallery-filter-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        {/* Lưới masonry */}
        <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <Tile key={photo.url as string} photo={photo} index={index} onOpen={() => setOpenIndex(index)} />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <Lightbox
        open={openIndex >= 0}
        index={openIndex}
        close={() => setOpenIndex(-1)}
        slides={slides}
        plugins={[Zoom, Thumbnails, Slideshow, Counter, Fullscreen]}
        animation={{ fade: 400, swipe: 450 }}
        carousel={{ finite: false, preload: 2 }}
        thumbnails={{ border: 0, borderRadius: 8, gap: 8, width: 90, height: 64, vignette: true }}
        slideshow={{ delay: 3500 }}
        zoom={{ maxZoomPixelRatio: 3 }}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        styles={{ container: { backgroundColor: "rgba(20, 8, 12, 0.94)", backdropFilter: "blur(8px)" } }}
      />
    </div>
  )
}
