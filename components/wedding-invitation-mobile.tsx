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
import AddressingPopup from "./addressing-popup"
import { useMobile } from "@/hooks/use-mobile"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  name: string
  message: string
  timestamp: number
}

const BOTTOM_NAV_HEIGHT = 80

export default function WeddingInvitationMobile() {
  const [currentSection, setCurrentSection] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [pageHeight, setPageHeight] = useState(0)
  const isMobile = useMobile()
  const bookRef = useRef<any>(null)

  useEffect(() => {
    const updatePageHeight = () => {
      const height = window.innerHeight - BOTTOM_NAV_HEIGHT
      setPageHeight(height)
    }

    updatePageHeight()
    // window.addEventListener("resize", updatePageHeight)
    window.addEventListener("orientationchange", updatePageHeight)

    return () => {
      // window.removeEventListener("resize", updatePageHeight)
      window.removeEventListener("orientationchange", updatePageHeight)
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

  const isFirstPage = currentSection === 0
  const isLastPage = currentSection === sections.length - 1

  const handleNextPage = () => {
    if (bookRef.current && !isLastPage) {
      bookRef.current.pageFlip().flipNext()
    }
  }

  const handlePrevPage = () => {
    if (bookRef.current && !isFirstPage) {
      bookRef.current.pageFlip().turnToPrevPage();
    }
  }

  const handleBackToTop = () => {
    if (bookRef.current) {
      const flipBook = bookRef.current.pageFlip()
      if (flipBook && typeof flipBook.flip === "function") {
        flipBook.flip(0)
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {isFirstPage ? <AddressingPopup /> : <></>}
      <MusicPlayer />

      <div className="page-container relative z-10" style={{ height: pageHeight > 0 ? `${pageHeight}px` : "100vh" }}>
        <HTMLFlipBook
          width={isMobile ? window.innerWidth : 375}
          height={pageHeight > 0 ? pageHeight : isMobile ? window.innerHeight - BOTTOM_NAV_HEIGHT : 684}
          size="stretch"
          minWidth={315}
          maxWidth={500}
          minHeight={400}
          maxHeight={1605}
          maxShadowOpacity={0.3}
          showCover={true}
          mobileScrollSupport={false}
          onFlip={(e: any) => setCurrentSection(e.data)}
          className="wedding-flipbook"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={false}
          useMouseEvents={false}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={true}
          ref={bookRef}
        >
          {sections.map((section, index) => {
            const Component = section.component
            return (
              <div key={section.id} className={cn("page min-h-full bg-background overflow-y-auto")}>
                {section.id === "messages" ? <Component messages={messages} /> : <Component />}

              </div>
            )
          })}
        </HTMLFlipBook>
        <FloatingHearts />
        <FloatingHearts />
        <FloatingHearts />
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-t border-primary/10 shadow-lg"
        style={{ height: `${BOTTOM_NAV_HEIGHT}px` }}
      >
        <div className="flex items-center justify-between px-6 h-full">
          {/* Previous button */}
          <Button
            onClick={handlePrevPage}
            disabled={isFirstPage}
            size="sm"
            variant="default"
            className="rounded-full bg-primary/90 shadow-lg backdrop-blur-sm hover:bg-primary active:scale-95 transition-transform touch-manipulation disabled:opacity-0 disabled:pointer-events-none h-12 w-12 p-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Page indicators */}
          <div className="flex gap-2">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (bookRef.current) {
                    const flipBook = bookRef.current.pageFlip()
                    if (flipBook && typeof flipBook.flip === "function") {
                      console.log(bookRef.current.pageFlip());
                      if (bookRef.current.pageFlip().getCurrentPageIndex() < index) {
                        flipBook.flip(index)
                      } else {
                        bookRef.current.pageFlip().turnToPage(index);
                      }

                    }
                  }
                }}
                className={`h-2 rounded-full transition-all touch-manipulation ${index === currentSection ? "w-8 bg-primary" : "w-2 bg-primary/30 active:bg-primary/50"
                  }`}
                aria-label={`Đi đến trang ${index + 1}`}
              />
            ))}
          </div>

          {/* Next or Home button */}
          {isLastPage ? (
            <Button
              onClick={handleBackToTop}
              size="sm"
              variant="default"
              className="rounded-full bg-primary/90 shadow-lg backdrop-blur-sm hover:bg-primary active:scale-95 transition-transform touch-manipulation h-12 w-12 p-0 opacity-0"
            >
              <Home className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={handleNextPage}
              size="sm"
              variant="default"
              className="rounded-full bg-primary/90 shadow-lg backdrop-blur-sm hover:bg-primary active:scale-95 transition-transform touch-manipulation h-12 w-12 p-0 animate-bounce"
              style={{
                animationDuration: '1.5s',
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
