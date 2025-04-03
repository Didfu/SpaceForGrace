import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata = {
  title: "Space For Grace",
  description: "Some thoughts combining mundane reality with scientific spirituality",
  generator: "Dhruv Mahyavanshi",
  icon: "/images/icon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={metadata.icon} />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="generator" content={metadata.generator} />
        
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-66J9ZLY3E9" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-66J9ZLY3E9');
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ServiceWorkerRegister /> {/* Register the service worker */}
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}