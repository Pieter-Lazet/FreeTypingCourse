import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "FreeTypingCourse — Free Touch Typing Trainer",
    template: "%s | FreeTypingCourse",
  },
  description:
    "Learn to type faster with 50 free lessons. No payment, no ads. Track your WPM and accuracy as you improve.",
  keywords: ["touch typing", "typing lessons", "learn to type", "typing trainer", "wpm", "free typing course", "touch typing trainer", "keyboard practice"],
  authors: [{ name: "FreeTypingCourse" }],
  metadataBase: new URL("https://freetypingcourse.vercel.app"),
  alternates: {
    canonical: "https://freetypingcourse.vercel.app",
  },
  openGraph: {
    title: "FreeTypingCourse — Free Touch Typing Trainer",
    description: "Learn to type faster with 50 free lessons. No payment, no ads.",
    type: "website",
    url: "https://freetypingcourse.vercel.app",
    siteName: "FreeTypingCourse",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FreeTypingCourse — Learn to type for free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeTypingCourse — Free Touch Typing Trainer",
    description: "Learn to type faster with 50 free lessons. Free forever.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": 160,
      "max-image-preview": "large",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "FreeTypingCourse",
              description: "Free touch typing trainer with 50 structured lessons",
              url: "https://freetypingcourse.vercel.app",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
