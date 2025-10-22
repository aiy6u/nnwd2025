"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import CoverPage from "./sections/cover-page"
import LoveStory from "./sections/love-story"
import WeddingDetails from "./sections/wedding-details"
import Gallery from "./sections/gallery"
import RSVP from "./sections/rsvp"
import Countdown from "./sections/countdown"
import Messages from "./sections/messages"
import FloatingHearts from "./floating-hearts"
import MusicPlayer from "./music-player"
import AddressingPopup from "./addressing-popup"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  name: string
  message: string
  timestamp: number
}

const SCROLL_THRESHOLD = 50;

export default function WeddingInvitation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [showScrollHint, setShowScrollHint] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const touchStartY = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const baseSections = [
    { id: "cover", component: CoverPage },
    { id: "countdown", component: Countdown },
    { id: "story", component: LoveStory },
    { id: "details", component: WeddingDetails },
    { id: "gallery", component: Gallery },
    { id: "rsvp", component: RSVP },
  ]

  const sections =
    messages.length >= 10
      ? [...baseSections.slice(0, 5), { id: "messages", component: Messages }, baseSections[5]]
      : baseSections

  const scrollToSection = useCallback((index: number) => {
    if (isScrollingRef.current) return

    const container = containerRef.current
    if (!container) return

    const sectionsElements = container.querySelectorAll(".section")
    const targetSection = sectionsElements[index] as HTMLElement

    if (targetSection) {
      isScrollingRef.current = true

      container.scrollTo({ top: targetSection.offsetTop, behavior: "smooth" })

      setCurrentSection(index)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 800)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) {
        e.preventDefault()
        return
      }

      const currentSectionElement = container.querySelectorAll(".section")[currentSection] as HTMLElement
      const isAtTop = currentSectionElement.scrollTop === 0
      const isAtBottom = currentSectionElement.scrollHeight - currentSectionElement.clientHeight <= currentSectionElement.scrollTop + 1

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = currentSection + direction

      if (
        (direction === -1 && isAtTop && nextIndex >= 0) ||
        (direction === 1 && isAtBottom && nextIndex < sections.length)
      ) {
        e.preventDefault()
        if (Math.abs(e.deltaY) > 5) {
          scrollToSection(nextIndex)
          setShowScrollHint(false)
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [currentSection, sections.length, scrollToSection])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return

      const currentSectionElement = container.querySelectorAll(".section")[currentSection] as HTMLElement
      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY.current - touchEndY

      if (Math.abs(deltaY) > SCROLL_THRESHOLD) {
        const direction = deltaY > 0 ? 1 : -1
        const nextIndex = currentSection + direction

        const isAtTop = currentSectionElement.scrollTop === 0
        const isAtBottom = currentSectionElement.scrollHeight - currentSectionElement.clientHeight <= currentSectionElement.scrollTop + 1

        if (
          (direction === -1 && isAtTop && nextIndex >= 0) ||
          (direction === 1 && isAtBottom && nextIndex < sections.length)
        ) {
          scrollToSection(nextIndex)
          setShowScrollHint(false)
        }
      }
    }

    container.addEventListener("touchmove", (e) => {
      if (isScrollingRef.current) e.preventDefault()
    }, { passive: false });

    container.addEventListener("touchstart", handleTouchStart)
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchmove", (e) => {
        if (isScrollingRef.current) e.preventDefault()
      })
    }
  }, [currentSection, sections.length, scrollToSection])

  useEffect(() => {
    const handleScrollPositionUpdate = () => {
      if (!containerRef.current || isScrollingRef.current) return

      const sectionsElements = containerRef.current.querySelectorAll(".section")
      const scrollPosition = containerRef.current.scrollTop + window.innerHeight / 2

      sectionsElements.forEach((section, index) => {
        const element = section as HTMLElement
        const top = element.offsetTop
        const bottom = top + element.offsetHeight

        if (scrollPosition >= top && scrollPosition < bottom) {
          setCurrentSection(index)
        }
      })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScrollPositionUpdate)
      return () => container.removeEventListener("scroll", handleScrollPositionUpdate)
    }
  }, [])

  useEffect(() => {
    const savedMessages = localStorage.getItem("wedding-messages")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed)
      } catch (e) {
        console.error("Failed to parse messages:", e)
      }
    }

    const handleStorageChange = () => {
      const savedMessages = localStorage.getItem("wedding-messages")
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages)
          setMessages(parsed)
        } catch (e) {
          console.error("Failed to parse messages:", e)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("messages-updated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("messages-updated", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (currentSection > 0) {
      setShowScrollHint(false)
    }
  }, [currentSection])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AddressingPopup />
      <FloatingHearts />
      <MusicPlayer />

      <div
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        {sections.map((section, index) => {
          const Component = section.component
          return (
            <div
              key={section.id}
              className="section h-screen overflow-y-auto"
              style={{ minHeight: '100vh' }}
            >
              {section.id === "messages" ? <Component messages={messages} /> : <Component />}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {showScrollHint && currentSection === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-12 left-1/2 z-40 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-sm font-medium text-primary">Cuộn xuống</p>
              <ChevronDown className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`h-3 rounded-full transition-all duration-300 ${index === currentSection
              ? "w-12 bg-primary shadow-lg shadow-primary/50"
              : "w-3 bg-primary/30 hover:bg-primary/50 hover:scale-110"
              }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}