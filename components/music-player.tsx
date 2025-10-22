"use client"

import { useState, useRef, useEffect } from "react"
import { Pause, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MUSIC_PREF_KEY = "wedding-music-preference"
const DEFAULT_MUSIC_PREF = "true"
const PAUSE_DELAY_MS = 500;

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioAvailable, setAudioAvailable] = useState(true)
  const [userPrefersMusic, setUserPrefersMusic] = useState(DEFAULT_MUSIC_PREF)
  const [isBuffering, setIsBuffering] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const wasPlayingBeforeInactive = useRef(false);

  const getMusicPreference = () => {
    return localStorage.getItem(MUSIC_PREF_KEY) || DEFAULT_MUSIC_PREF;
  }

  const isMusicOn = () => {
    return getMusicPreference() === "true";
  }

  const pauseMusic = (manualPause = true) => {
    if (!audioRef.current) return;

    const delay = manualPause ? PAUSE_DELAY_MS : 0;

    setTimeout(() => {
      audioRef.current?.pause();
      setIsPlaying(false);

      if (manualPause) {
        wasPlayingBeforeInactive.current = false;
        localStorage.setItem(MUSIC_PREF_KEY, "false");
        setUserPrefersMusic("false");
      }

      setIsToggling(false);
    }, delay);
  };

  const tryPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioAvailable && isMusicOn()) {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch((e) => {
        console.error("Play failed:", e);
        setIsPlaying(false)
      });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleVisibilityChange = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Kiểm tra trạng thái phát nhạc thực tế từ phần tử audio
    const audioIsActuallyPlaying = !audio.paused;

    if (document.hidden) {
      if (audioIsActuallyPlaying) {
        wasPlayingBeforeInactive.current = true;
        pauseMusic(false);
      } else {
        wasPlayingBeforeInactive.current = false;
      }
    } else {
      if (wasPlayingBeforeInactive.current && isMusicOn()) {
        tryPlay();
      }
      wasPlayingBeforeInactive.current = false;
    }
  };

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const initialPref = getMusicPreference();
    setUserPrefersMusic(initialPref);
    const musicIsOnInit = initialPref === "true";


    const handleCanPlay = () => {
      setIsBuffering(false);
      // Loại bỏ tryPlay() tự động khởi tạo để tránh lỗi auto-play.
    };

    const handleError = () => {
      setAudioAvailable(false);
      setIsPlaying(false);
      setIsBuffering(false);
      console.error("Audio loading error!");
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    if (musicIsOnInit) {
      audio.load();
    } else {
      setIsBuffering(false);
    }

    window.addEventListener("music-preference-updated", tryPlay);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      window.removeEventListener("music-preference-updated", tryPlay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [audioAvailable])

  const togglePlay = () => {
    if (audioRef.current && audioAvailable && !isToggling) {
      setIsToggling(true);

      const newIsPlaying = !isPlaying;

      if (newIsPlaying) {
        wasPlayingBeforeInactive.current = false;

        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((e) => {
          console.error("Play failed:", e);
          setIsPlaying(false);
        }).finally(() => {
          setIsToggling(false);
        });

        localStorage.setItem(MUSIC_PREF_KEY, "true");
        setUserPrefersMusic("true");

      } else {
        pauseMusic(true);
      }

      window.dispatchEvent(new Event("music-preference-updated"));
    }
  }

  if (!audioAvailable) {
    return null
  }

  const isDisabled = (isBuffering && userPrefersMusic === "true") || isToggling;

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <span className="block text-xs text-muted-foreground bg-card/10 backdrop-blur-sm px-3 py-2 rounded-full border border-primary/20">
        {isToggling ? "Đang xử lý..." : isBuffering ? "Đang tải nhạc..." : isPlaying ? "Nhạc đang phát" : "Nhấn để phát"}
      </span>
      <Button
        onClick={togglePlay}
        size="icon"
        disabled={isDisabled}
        className={cn(
          "relative h-12 w-12 rounded-full border-2 border-primary/30 bg-card/80 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all overflow-hidden",
          { "bg-transparent border-transparent": isPlaying }
        )}
      >
        {isPlaying && (
          <div
            className="absolute inset-0 bg-cover bg-center rounded-full animate-spin border border-white shadow"
            style={{
              backgroundImage: "url('/westlife-vinyl.jpg')",
              animationDuration: '5s'
            }}
          >
            <div className="absolute inset-0 rounded-full bg-black/10"></div>
          </div>
        )}

        <div className="relative z-10 flex items-center justify-center">
          {isDisabled ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5 text-white drop-shadow-lg" />
          ) : (
            <Play className="h-5 w-5 text-primary" />
          )}
        </div>
      </Button>
      <audio ref={audioRef} loop src="/wedding-music.mp3" onEnded={() => setIsPlaying(false)} />
    </div>
  )
}