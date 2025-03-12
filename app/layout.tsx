import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Next.js Blog",
    description: "A modern blog built with Next.js and Tailwind CSS",
        generator: 'v0.dev'
        }

        export default function RootLayout({
          children,
          }: {
            children: React.ReactNode
            }) {
              return (
                  <html lang="en" suppressHydrationWarning>
                        <body className={inter.className}>
                                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                                          <main>{children}</main>
                                                  </ThemeProvider>
                                                        </body>
                                                            </html>
                                                              )
                                                              }



                                                              import './globals.css'