import type React from "react"
import type { Metadata } from "next"
import { Imperial_Script, Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import "yet-another-react-lightbox/plugins/counter.css"
import "./globals.css"
import { Suspense } from "react"

// Ba font đều có bộ ký tự tiếng Việt đầy đủ dấu
const scriptFont = Imperial_Script({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-script-vn",
  display: "swap",
})

const serifFont = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif-vn",
  display: "swap",
})

const sansFont = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans-vn",
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
    <html lang="vi">
      <body
        className={`font-sans ${GeistMono.variable} ${scriptFont.variable} ${serifFont.variable} ${sansFont.variable}`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
