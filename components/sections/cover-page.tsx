"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

// Định nghĩa kiểu dữ liệu cho cặp xưng hô
interface AddressingPair {
    self: string;
    other: string;
}

const ADDRESSING_KEY = "wedding-addressing-pair";

export default function CoverPage() {
    // State để lưu cách xưng hô bản thân (self)
    // Đặt giá trị mặc định là "Chúng tôi" hoặc một từ chung nào đó
    const [addressingSelf, setAddressingSelf] = useState<string>("Chúng tôi"); 

    useEffect(() => {
        const storedPair = localStorage.getItem(ADDRESSING_KEY);
        if (storedPair) {
            try {
                const parsedPair: AddressingPair = JSON.parse(storedPair);
                // Lấy giá trị 'self' (Xưng hô bản thân) để hiển thị trên trang bìa
                if (parsedPair.self) {
                    setAddressingSelf(parsedPair.self);
                }
            } catch (e) {
                // Giữ nguyên giá trị mặc định nếu parsing lỗi
            }
        }
    }, [])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-8"
            >
                {/* Decorative element */}
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="mx-auto"
                >
                    <Heart className="h-16 w-16 fill-primary text-primary" />
                </motion.div>

                {/* Couple names */}
                <div className="space-y-4">
                    <h1 className="font-script text-5xl text-primary sm:text-6xl md:text-7xl">Nghĩa</h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-primary/30" />
                        <Heart className="h-6 w-6 fill-primary text-primary" />
                        <div className="h-px w-12 bg-primary/30" />
                    </div>
                    <h1 className="font-script text-5xl text-primary sm:text-6xl md:text-7xl">Nhung</h1>
                </div>

                {/* Full names */}
                <div className="space-y-2 text-foreground/80">
                    <p className="font-serif text-lg">Nguyễn Trọng Nghĩa</p>
                    <p className="font-serif text-lg">Văn Thị Nhung</p>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="space-y-2">
                    {/* Đã cập nhật để sử dụng addressingSelf */}
                    <p className="font-serif text-sm uppercase tracking-widest text-muted-foreground">{addressingSelf} Sắp Kết Hôn</p>
                    <p className="font-serif text-2xl font-semibold text-foreground">23 Tháng 11, 2025</p>
                </motion.div>
            </motion.div>
        </div>
    )
}