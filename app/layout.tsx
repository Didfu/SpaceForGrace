import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import localFont from "next/font/local"

// Correct font import from public folder
const balaram = localFont({
  src: "../public/fonts/BALARAM.ttf", // Corrected path
  display: "swap",
})

export const metadata = {
  title: "Space For Grace",
  description: "Some thoughts combining mundane reality with scientific spirituality",
  generator: "Dhruv Mahyavanshi",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={balaram.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
