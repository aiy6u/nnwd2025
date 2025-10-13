"use client"

import { motion } from "framer-motion"
import { ChevronRight, ArrowUp } from "lucide-react"

interface SwipeIndicatorProps {
  isLastPage?: boolean
  onBackToTop?: () => void
}

export default function SwipeIndicator({ isLastPage = false, onBackToTop }: SwipeIndicatorProps) {
  if (isLastPage && onBackToTop) {
    return (
      <motion.button
        onClick={onBackToTop}
        className="fixed bottom-24 left-6 z-40 flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 shadow-lg"
        initial={{ opacity: 0, x: 10 }}
        animate={{
          opacity: [0.7, 1, 0.7],
          x: [10, 0, 10],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <ArrowUp className="h-5 w-5 text-primary-foreground" />
        <span className="font-serif text-sm text-primary-foreground">Về đầu</span>
      </motion.button>
    )
  }

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-40 flex items-center gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{
        opacity: [0.5, 1, 0.5],
        x: [-10, 0, -10],
      }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <span className="font-serif text-sm text-primary">Vuốt</span>
      <ChevronRight className="h-5 w-5 text-primary" />
    </motion.div>
  )
}
