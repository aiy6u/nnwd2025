"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface Message {
  name: string
  message: string
  timestamp: number
}

interface MessagesProps {
  messages?: Message[]
}

export default function Messages({ messages = [] }: MessagesProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <Heart className="mx-auto h-12 w-12 text-primary" fill="currentColor" />
          </motion.div>
          <h2 className="font-script text-5xl text-primary">Lời Chúc Mừng</h2>
          <p className="font-serif text-sm text-muted-foreground">Wishes</p>
          <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
            Cảm ơn những lời chúc tốt đẹp của bạn
          </p>
          <p className="text-balance text-sm text-muted-foreground">Thank you for your warm wishes and blessings</p>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-serif">Chưa có lời chúc / No messages yet</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-card p-6 shadow-md border border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" fill="currentColor" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-serif font-semibold text-foreground">{msg.name}</p>
                    <p className="font-serif text-sm leading-relaxed text-foreground/80">{msg.message}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
