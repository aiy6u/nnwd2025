"use client"

import { useState, useRef, useEffect } from "react"
import HTMLFlipBook from "react-pageflip"
import CoverPage from "./sections/cover-page"
import LoveStory from "./sections/love-story"
import WeddingDetails from "./sections/wedding-details"
import Gallery from "./sections/gallery"
import RSVP from "./sections/rsvp"
import Countdown from "./sections/countdown"
import Messages from "./sections/messages"
import FloatingHearts from "./floating-hearts"
import MusicPlayer from "./music-player"
import VietnameseFrame from "./vietnamese-frame"
import SwipeIndicator from "./swipe-indicator"
import AddressingPopup from "./addressing-popup"
import { useMobile } from "@/hooks/use-mobile"

interface Message {
  name: string
  message: string
  timestamp: number
}

export default function WeddingInvitation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const isMobile = useMobile()
  const bookRef = useRef<any>(null)

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

    // Listen for new messages
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

  const isLastPage = currentSection === sections.length - 1

  const handleBackToTop = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flip(0)
    }
  }

  const content = (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AddressingPopup />

      <FloatingHearts />
      <MusicPlayer />

      <div className="page-container relative z-10 min-h-screen overflow-y-scroll -scroll-mr-5">
        <HTMLFlipBook
          width={isMobile ? window.innerWidth : 375}
          height={isMobile ? window.innerHeight : 812}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={(e: any) => setCurrentSection(e.data)}
          className="wedding-flipbook"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          ref={bookRef}
        >
          {sections.map((section, index) => {
            const Component = section.component
            return (
              <div key={section.id} className="page min-h-screen bg-background">
                {section.id === "messages" ? <Component messages={messages} /> : <Component />}
              </div>
            )
          })}
        </HTMLFlipBook>
      </div>

      <SwipeIndicator isLastPage={isLastPage} onBackToTop={isLastPage ? handleBackToTop : undefined} />

      {/* Navigation dots */}
      <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (bookRef.current) {
                bookRef.current.pageFlip().flip(index)
              }
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentSection ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )

  if (!isMobile) {
    return <VietnameseFrame>{content}</VietnameseFrame>
  }

  return content
}
