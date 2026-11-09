import type React from "react"
import type { Metadata } from "next"
import { Great_Vibes, Playfair_Display } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nghĩa ❤️ Nhung - 1st Wedding Anniversary",
  description: "Celebrating our 1st wedding anniversary - November 11, 2026",
  generator: "NTNSOFT.com",
  openGraph: {
    title: "Nghĩa ❤️ Nhung - Kỷ Niệm 1 Năm Ngày Cưới",
    description: "Tròn 1 năm về chung một nhà - cảm ơn bạn đã luôn đồng hành cùng chúng tôi.",
    url: 'https://nnwd2025.info',
    siteName: 'Nghia & Nhung Wedding',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Kỷ niệm 1 năm ngày cưới Nghĩa và Nhung',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nghĩa ❤️ Nhung - Kỷ Niệm 1 Năm Ngày Cưới",
    description: "Tròn 1 năm về chung một nhà - cảm ơn bạn đã luôn đồng hành cùng chúng tôi.",
    images: ['/og.jpg'], // Sử dụng cùng ảnh OG
  },
  icons: {
    icon: "/favicon/favicon.ico", // Standard favicon, usually 16x16, 32x32
    shortcut: "/favicon/favicon-16x16.png", // Optional shortcut icon
    apple: "/favicon/apple-touch-icon.png", // Recommended size: 180x180
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${greatVibes.variable} ${playfair.variable}`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
