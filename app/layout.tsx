import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt"; // ✅ Import the PWAInstallPrompt component

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

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-66J9ZLY3E9"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-66J9ZLY3E9');

  (function enhancedAnalytics() {
    const ua = navigator.userAgent.toLowerCase();
    const ref = document.referrer;

    let source = 'direct';
    if (ref.includes('linkedin')) source = 'LinkedIn';
    else if (ua.includes('whatsapp')) source = 'WhatsApp';
    else if (ua.includes('instagram')) source = 'Instagram';
    else if (ua.includes('facebook')) source = 'Facebook';
    else if (ref) source = new URL(ref).hostname;

    gtag('event', 'visit_source', {
      event_category: 'traffic',
      event_label: source,
    });

    let os = 'Unknown OS';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    const isMobile = /iphone|android|ipad|mobile/.test(ua);
    const deviceType = isMobile ? 'Mobile' : 'Desktop';

    gtag('event', 'device_info', {
      event_category: 'environment',
      event_label: \`\${deviceType} - \${os}\`,
    });

    let scrollPoints = [25, 50, 75, 90];
    let triggeredScrolls = new Set();

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolledPercent = Math.floor((scrollTop / docHeight) * 100);

      scrollPoints.forEach((point) => {
        if (scrolledPercent >= point && !triggeredScrolls.has(point)) {
          triggeredScrolls.add(point);
          gtag('event', 'scroll_depth', {
            event_category: 'engagement',
            event_label: \`\${point}%\`,
          });
        }
      });
    });

    const timePoints = [15, 30, 60, 120];
    timePoints.forEach((seconds) => {
      setTimeout(() => {
        gtag('event', 'time_on_page', {
          event_category: 'engagement',
          event_label: \`\${seconds} seconds\`,
        });
      }, seconds * 1000);
    });

    if (!isMobile) {
      let exitTracked = false;
      document.addEventListener('mouseleave', (e) => {
        if (!exitTracked && e.clientY < 10) {
          exitTracked = true;
          gtag('event', 'exit_intent', {
            event_category: 'engagement',
            event_label: 'Mouse leave top',
          });
        }
      });
    }
  })();
`}
        </Script>

      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ServiceWorkerRegister /> {/* Register the service worker */}
          <PWAInstallPrompt /> {/* Add the PWA install prompt */}
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}