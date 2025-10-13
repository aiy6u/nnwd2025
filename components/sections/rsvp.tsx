"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import QRCodePayment from "@/components/qr-code-payment"

type Step = "form" | "qr" | "thankyou"

interface AddressingPair {
    self: string;
    other: string;
}
const ADDRESSING_KEY = "wedding-addressing-pair";

export default function RSVP() {
    const [step, setStep] = useState<Step>("form")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        locations: [] as string[],
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

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

    const handleLocationChange = (location: string, checked: boolean) => {
        if (checked) {
            setFormData({ ...formData, locations: [...formData.locations, location] })
        } else {
            setFormData({ ...formData, locations: formData.locations.filter((l) => l !== location) })
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsSubmitting(false)

        if (formData.locations.length === 0) {
            setStep("qr")
        } else {
            handlePaymentConfirm()
        }
    }

    const handlePaymentConfirm = async () => {
        try {
            if (formData.message.trim()) {
                const existingMessages = localStorage.getItem("wedding-messages")
                const messages = existingMessages ? JSON.parse(existingMessages) : []
                messages.push({
                    name: formData.name,
                    message: formData.message,
                    timestamp: Date.now(),
                })
                localStorage.setItem("wedding-messages", JSON.stringify(messages))

                window.dispatchEvent(new Event("messages-updated"))
            }

            await fetch("/api/send-rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            toast({
                title: "Cảm ơn bạn! / Thank you!",
                description: "Chúng tôi đã nhận được phản hồi của bạn. / Your RSVP has been received.",
            })

            setStep("thankyou")
        } catch (error) {
            toast({
                title: "Lỗi / Error",
                description: "Không thể gửi. Vui lòng thử lại. / Failed to send RSVP. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (step === "thankyou") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl space-y-8 text-center"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
                        >
                            <svg className="h-12 w-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                        <h2 className="font-script text-5xl text-primary">Cảm Ơn {otherAddressing}!</h2>
                        <p className="font-serif text-2xl text-foreground">Thank You!</p>
                        <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
                            {selfAddressing} đã nhận được xác nhận của {otherAddressing}. Rất mong được gặp {otherAddressing}!
                        </p>
                        <p className="text-balance text-sm text-muted-foreground">
                            We have received your RSVP. We look forward to celebrating with you!
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (step === "qr") {
        return <QRCodePayment formData={formData} onConfirm={handlePaymentConfirm} onBack={() => setStep("form")} />
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl space-y-12"
            >
                <div className="space-y-4 text-center">
                    <h2 className="font-script text-5xl text-primary">Xác Nhận Tham Dự</h2>
                    <p className="font-serif text-sm text-muted-foreground">RSVP</p>
                    <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
                        Vui lòng cho {selfAddressing} biết {otherAddressing} có thể tham dự không
                    </p>
                    <p className="text-balance text-sm text-muted-foreground">
                        Please let us know if you can join us on our special day
                    </p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl bg-card p-8 shadow-lg"
                >
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-serif text-foreground">
                            Tên của {otherAddressing} / Your Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="border-border bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-serif text-foreground">
                            Email của {otherAddressing} / Your Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="border-border bg-background"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="font-serif text-foreground">{otherAddressing} sẽ tham dự ở đâu? / Where will you attend?</Label>
                        <div className="space-y-3 rounded-lg bg-background/50 p-4">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="nha-gai"
                                    checked={formData.locations.includes("nha-gai")}
                                    onCheckedChange={(checked) => handleLocationChange("nha-gai", checked as boolean)}
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="nha-gai" className="font-normal leading-none cursor-pointer">
                                        Lễ Vu Quy - Nhà Gái
                                    </Label>
                                    <p className="text-xs text-muted-foreground">8:00 Sáng, 23/11/2025</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="nha-trai"
                                    checked={formData.locations.includes("nha-trai")}
                                    onCheckedChange={(checked) => handleLocationChange("nha-trai", checked as boolean)}
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="nha-trai" className="font-normal leading-none cursor-pointer">
                                        Lễ Thành Hôn - Nhà Trai
                                    </Label>
                                    <p className="text-xs text-muted-foreground">11:00 Sáng, 23/11/2025</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="da-nang"
                                    checked={formData.locations.includes("da-nang")}
                                    onCheckedChange={(checked) => handleLocationChange("da-nang", checked as boolean)}
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="da-nang" className="font-normal leading-none cursor-pointer">
                                        Tiệc Báo Hỉ - Đà Nẵng
                                    </Label>
                                    <p className="text-xs text-muted-foreground">6:00 Chiều, 30/11/2025</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground italic">
                                    Không chọn địa điểm nào = Không thể đến nhưng chúc phúc ❤️
                                </p>
                                <p className="text-xs text-muted-foreground">No location selected = Can't attend but congratulations</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="font-serif text-foreground">
                            Lời nhắn cho cô dâu chú rể / Message for the couple
                        </Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            className="border-border bg-background"
                            placeholder="Gửi lời chúc của bạn... / Share your wishes..."
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-primary py-6 font-serif text-lg text-primary-foreground hover:bg-primary/90"
                    >
                        {isSubmitting ? "Đang gửi... / Sending..." : "Gửi xác nhận / Send RSVP"}
                    </Button>
                </motion.form>
            </motion.div>
        </div>
    )
}