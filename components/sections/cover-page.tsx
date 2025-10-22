"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface AddressingPair {
    self: string
    other: string
}

const ADDRESSING_KEY = "wedding-addressing-pair"
const WEDDING_DATE = "06 Tháng 11, 2025"
const WEDDING_DAY_DETAIL = "Thứ 5, ngày 06 tháng 11 năm 2025"
const WEDDING_LUNAR_DATE = "Nhằm ngày 17 tháng 9 âm lịch"

export default function CoverPage() {
    const [addressingSelf, setAddressingSelf] = useState<string>("Chúng tôi")

    useEffect(() => {
        const loadAddressing = () => {
            const storedPair = localStorage.getItem(ADDRESSING_KEY)
            if (storedPair) {
                try {
                    const parsedPair: AddressingPair = JSON.parse(storedPair)
                    if (parsedPair.self) {
                        setAddressingSelf(parsedPair.self)
                    }
                } catch (e) {
                }
            }
        }

        loadAddressing()

        window.addEventListener("addressing-updated", loadAddressing)
        return () => window.removeEventListener("addressing-updated", loadAddressing)
    }, [])

    return (
        <div className="flex min-h-full md:min-h-screen flex-col items-center justify-center px-6 text-center md:px-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-8 md:space-y-12"
            >
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="mx-auto"
                >
                    <Heart className="h-12 w-12 fill-primary text-primary md:h-20 md:w-20" />
                </motion.div>

                <div className="space-y-4 md:space-y-6">
                    <h1 className="font-script text-5xl text-primary sm:text-6xl md:text-8xl lg:text-9xl">Nghĩa</h1>
                    <div className="flex items-center justify-center gap-4 md:gap-8">
                        <div className="h-px w-12 bg-primary/30 md:w-24" />
                        <Heart className="h-6 w-6 fill-primary text-primary md:h-8 md:w-8" />
                        <div className="h-px w-12 bg-primary/30 md:w-24" />
                    </div>
                    <h1 className="font-script text-5xl text-primary sm:text-6xl md:text-8xl lg:text-9xl">Nhung</h1>
                </div>

                <div className="space-y-2 text-foreground/80">
                    <p className="font-serif text-base md:text-xl lg:text-2xl">Nguyễn Trọng Nghĩa</p>
                    <p className="font-serif text-base md:text-xl lg:text-2xl">Văn Thị Nhung</p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="space-y-2 md:space-y-3"
                >
                    <p className="font-serif text-xs uppercase tracking-widest text-muted-foreground md:text-sm">
                        {addressingSelf} Sắp Kết Hôn
                    </p>
                    {/* Hiển thị Thứ và Ngày Dương */}
                    <p className="font-serif text-xl font-semibold text-foreground md:text-3xl lg:text-4xl">
                        {WEDDING_DAY_DETAIL}
                    </p>
                    {/* Hiển thị Ngày Âm Lịch */}
                    <p className="font-serif text-base font-medium text-foreground/80 md:text-xl">
                        {WEDDING_LUNAR_DATE}
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}