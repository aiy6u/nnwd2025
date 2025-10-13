"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, Syringe as Ring } from "lucide-react"

interface AddressingPair {
    self: string;
    other: string;
}
const ADDRESSING_KEY = "wedding-addressing-pair";

export default function LoveStory() {
    const [addressingPair, setAddressingPair] = useState<AddressingPair>({
        self: "Chúng tôi",
        other: "Quý vị",
    });

    useEffect(() => {
        const storedPair = localStorage.getItem(ADDRESSING_KEY);
        if (storedPair) {
            try {
                const parsedPair: AddressingPair = JSON.parse(storedPair);
                if (parsedPair.self && parsedPair.other) {
                    setAddressingPair(parsedPair);
                }
            } catch (e) {
            }
        }
    }, [])
    
    const selfAddressing = addressingPair.self;
    const otherAddressing = addressingPair.other;

    const timeline = [
        {
            icon: Sparkles,
            title: "Gặp Gỡ Lần Đầu",
            date: "Tháng 8/2018",
            description: "Cùng nhau đi vinh danh, lần đầu gặp gỡ và điều kỳ diệu đã xảy ra.",
        },
        {
            icon: Heart,
            title: "Lời Tỏ Tình",
            date: "Ngày 2/6/2019",
            description: `Bờ biển Nha Trang chứng kiến khởi đầu tuyệt đẹp cho câu chuyện tình yêu của ${selfAddressing}.`,
        },
        {
            icon: Sparkles,
            title: "Hành Trình Yêu Thương",
            date: "2020 - 2025",
            description: `Những kỷ niệm khó quên cùng bao thăng trầm sóng gió, nơi ${selfAddressing} yêu thương và trưởng thành.`,
        },
        {
            icon: Ring, // Syringe as Ring
            title: "Lời Cầu Hôn",
            date: "Ngày 5/10/2025",
            description: `Anh hỏi, em đồng ý! ${selfAddressing} chuẩn bị bước sang một chương mới của cuộc đời.`,
        },
        {
            icon: Heart,
            title: "Trang Mới",
            date: "Hiện Tại",
            description: `Và hiện tại, câu chuyện của ${selfAddressing} càng thêm ý nghĩa với sự góp mặt của ${otherAddressing}.`,
        },
    ]

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl space-y-12"
            >
                <div className="space-y-4 text-center">
                    <h2 className="font-script text-5xl text-primary">Câu Chuyện Tình Yêu</h2>
                    <p className="font-serif text-sm text-muted-foreground">Our Love Story</p>
                </div>

                <div className="relative space-y-8">
                    <div className="absolute left-8 top-0 h-full w-0.5 bg-primary/20 sm:left-1/2" />

                    {timeline.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className={`relative flex items-center gap-8 ${
                                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                                }`}
                            >
                                <div className="absolute left-8 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-lg sm:left-1/2">
                                    <Icon className="h-8 w-8 text-primary-foreground" />
                                </div>

                                <div className={`ml-24 w-full sm:ml-0 sm:w-5/12 ${index % 2 === 0 ? "sm:text-right" : "sm:text-left"}`}>
                                    <div className="rounded-2xl bg-card p-6 shadow-lg">
                                        <p className="mb-2 text-sm font-semibold text-accent">{item.date}</p>
                                        <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-sm leading-relaxed text-foreground/80">{item.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>
        </div>
    )
}