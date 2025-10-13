"use client"

import { useState, useRef, useEffect } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioAvailable, setAudioAvailable] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("error", () => {
        setAudioAvailable(false)
        setIsPlaying(false)
      })
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current && audioAvailable) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          setAudioAvailable(false)
          setIsPlaying(false)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (!audioAvailable) {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <Button
        onClick={togglePlay}
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-full border-2 border-primary/30 bg-card/80 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all"
      >
        {isPlaying ? <Pause className="h-5 w-5 text-primary" /> : <Play className="h-5 w-5 text-primary" />}
      </Button>
      <audio ref={audioRef} loop src="/wedding-music.mp3" onEnded={() => setIsPlaying(false)} />
    </div>
  )
}
