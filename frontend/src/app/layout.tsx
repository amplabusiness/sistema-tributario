import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema Tributário 100% IA",
  description: "Primeiro sistema tributário brasileiro totalmente autônomo com inteligência artificial",
  keywords: "tributário, ICMS, PIS, COFINS, IRPJ, CSLL, automação, IA, Brasil",
  authors: [{ name: "Sistema Tributário IA" }],
  creator: "Sistema Tributário IA",
  publisher: "Sistema Tributário IA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sistema-tributario-ia.com'),
  openGraph: {
    title: "Sistema Tributário 100% IA",
    description: "Primeiro sistema tributário brasileiro totalmente autônomo",
    url: "https://sistema-tributario-ia.com",
    siteName: "Sistema Tributário IA",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema Tributário 100% IA",
    description: "Primeiro sistema tributário brasileiro totalmente autônomo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} h-full bg-background text-foreground antialiased`}>
        <div className="relative flex min-h-full flex-col">
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
} 