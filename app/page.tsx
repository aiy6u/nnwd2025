"use client"
import WeddingInvitation from "@/components/wedding-invitation"
import WeddingInvitationMobile from "@/components/wedding-invitation-mobile"
import { useMobile } from "@/hooks/use-mobile"

export default function Home() {
  const isMobile = useMobile()
  if (isMobile) {
    return <WeddingInvitationMobile />
  } else {
    return <WeddingInvitation />
  }
}
