"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface AddressingPair {
  self: string;
  other: string;
}

const selfAddressingOptions = [
  { key: "chung-con", value: "Chúng con" },
  { key: "chung-chau", value: "Chúng cháu" },
  { key: "vo-chong-chau", value: "Vợ chồng cháu" },
  { key: "chung-minh", value: "Chúng mình" },
  { key: "anh-chi", value: "Anh/Chị" },
  { key: "em", value: "Em" },
];

const otherAddressingOptions = [
  { value: "", label: "Chọn cách gọi..." },
  { value: "Ông/Bà", label: "Ông/Bà" },
  { value: "Bố/Mẹ", label: "Bố/Mẹ" },
  { value: "Bác", label: "Bác" },
  { value: "Cô", label: "Cô" },
  { value: "Chú", label: "Chú" },
  { value: "Anh", label: "Anh" },
  { value: "Chị", label: "Chị" },
  { value: "Em", label: "Em" },
  { value: "Cháu", label: "Cháu" },
  { value: "Bạn", label: "Bạn" },
  { value: "Quý vị", label: "Quý vị" },
];

const ADDRESSING_KEY = "wedding-addressing-pair";

export default function AddressingPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [addressingPair, setAddressingPair] = useState<AddressingPair>({ self: "", other: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedPair = localStorage.getItem(ADDRESSING_KEY);
    if (storedPair) {
      try {
        const parsedPair: AddressingPair = JSON.parse(storedPair);
        if (parsedPair.self && parsedPair.other) {
          setAddressingPair(parsedPair);
          setIsOpen(false);
          return;
        }
      } catch (e) {
        // Ignore error, proceed to open popup
      }
    }
    setIsOpen(true);
  }, [])

  const handleSelectSelf = (value: string) => {
    setAddressingPair(prev => ({ ...prev, self: value }));
  }

  const handleSelectOther = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddressingPair(prev => ({ ...prev, other: e.target.value }));
  }

  const handleSave = () => {
    if (addressingPair.self.trim() && addressingPair.other.trim()) {
      setIsSaving(true);
      try {
        const dataToSave: AddressingPair = {
          self: addressingPair.self.trim(),
          other: addressingPair.other.trim(),
        };
        localStorage.setItem(ADDRESSING_KEY, JSON.stringify(dataToSave));
        setIsOpen(false);
      } catch (e) {
        // Ignore error
      } finally {
        setIsSaving(false);
      }
    }
  }

  const isFormValid = addressingPair.self.trim() && addressingPair.other.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex justify-center bg-foreground/80 p-4 backdrop-blur-sm overflow-y-auto py-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-3xl bg-background p-8 shadow-2xl my-auto"
          >
            <div className="mb-6 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 fill-primary text-primary" />
              <h2 className="mb-2 font-script text-3xl text-primary">Xin chào!</h2>
              <p className="text-sm text-muted-foreground">Vui lòng chọn cách xưng hô phù hợp.</p>
            </div>

            <div className="space-y-6">
              {/* Gọi đối phương */}
              <div>
                <label htmlFor="other-addressing" className="mb-2 block text-base font-semibold text-foreground">
                  Chúng tôi gọi bạn là...?
                </label>
                <select
                  id="other-addressing"
                  value={addressingPair.other}
                  onChange={handleSelectOther}
                  className="w-full rounded-xl border-2 border-input bg-background p-3 text-base text-foreground focus:border-primary focus:outline-none"
                >
                  {otherAddressingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Xưng hô bản thân */}
              <div>
                <h3 className="mb-3 text-base font-semibold text-foreground">Xưng...?</h3>
                <div className="space-y-2">
                  {selfAddressingOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleSelectSelf(option.value)}
                      variant="outline"
                      className={`h-auto w-full justify-start rounded-2xl border-2 p-4 text-left transition-all 
                                                ${addressingPair.self === option.value ? "border-primary bg-primary/5" : "hover:border-primary hover:bg-primary/5"}`}
                    >
                      <div className="font-serif text-lg font-semibold text-foreground">{option.value}</div>
                    </Button>
                  ))}
                </div>
              </div>



              <Button
                onClick={handleSave}
                className="w-full rounded-2xl"
                disabled={!isFormValid || isSaving}
              >
                {isSaving ? "Đang lưu..." : "Xác nhận và tiếp tục"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}