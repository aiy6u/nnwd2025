"use client"

import { motion } from "framer-motion"

const YOUTUBE_ID = "zRJA-rltlY0"

export default function Video() {
  return (
    <div className="flex min-h-full md:min-h-screen flex-col items-center justify-center px-6 py-20 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-10"
      >
        <div className="space-y-4 text-center">
          <h2 className="font-script text-4xl text-primary md:text-6xl lg:text-7xl">Thước Phim Cưới</h2>
          <p className="font-serif text-xs text-muted-foreground md:text-sm">Our Wedding Film</p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-xl">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0`}
            title="Phim cưới Nghĩa và Nhung"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <p className="text-center font-serif text-sm text-muted-foreground">
          Không xem được?{" "}
          <a
            href={`https://youtu.be/${YOUTUBE_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Mở trên YouTube
          </a>
        </p>
      </motion.div>
    </div>
  )
}
