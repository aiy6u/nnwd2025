"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

interface QRCodePaymentProps {
    formData: {
        name: string
        email: string
        locations?: string[]
        message: string
    }
    onConfirm: () => void
    onBack: () => void
}

interface AddressingPair {
    self: string;
    other: string;
}
const ADDRESSING_KEY = "wedding-addressing-pair";

export default function QRCodePayment({ formData, onConfirm, onBack }: QRCodePaymentProps) {
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

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-8">
                <Button variant="ghost" onClick={onBack} className="mb-4 gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại / Back
                </Button>

                <div className="space-y-4 text-center">
                    <h2 className="font-script text-5xl text-primary">Gửi Quà Mừng</h2>
                    <p className="font-serif text-sm text-muted-foreground">Send Your Gift</p>
                    <p className="text-balance font-serif text-base leading-relaxed text-foreground/80">
                        Cảm ơn {otherAddressing} đã xác nhận! Nếu muốn gửi quà mừng, vui lòng quét mã QR bên dưới.
                    </p>
                    <p className="text-balance text-sm text-muted-foreground">
                        Thank you for your RSVP! If you'd like to send a gift, please scan the QR code below
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6 rounded-2xl bg-card p-8 shadow-lg"
                >
                    <div className="mx-auto flex aspect-square w-full max-w-sm flex-col items-center justify-center rounded-xl bg-white p-4">
                        <img
                            src="/qr-code-for-bank-transfer.jpg"
                            alt="QR Code for bank transfer"
                            className="h-full w-full rounded-lg object-contain"
                        />
                    </div>

                    <div className="space-y-3 rounded-lg bg-background/50 p-4 text-center">
                        <p className="font-serif text-sm font-semibold text-foreground">Thông tin chuyển khoản / Bank Details</p>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Ngân hàng / Bank: Vietcombank</p>
                            <p>Số tài khoản / Account: 1234567890</p>
                            <p>Tên / Name: NGUYEN TRONG NGHIA</p>
                            <p className="font-medium text-foreground">Nội dung / Content: {formData.name} - Mung cuoi</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={onConfirm}
                            className="w-full rounded-full bg-primary py-6 font-serif text-lg text-primary-foreground hover:bg-primary/90"
                        >
                            Tôi đã chuyển khoản / I've Sent the Gift
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant="outline"
                            className="w-full rounded-full border-2 py-6 font-serif text-lg bg-transparent"
                        >
                            Bỏ qua / Skip
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}