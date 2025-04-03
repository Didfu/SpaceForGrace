"use client";

import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("beforeinstallprompt event fired");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <button
      id="install-button"
      style={{
        display: deferredPrompt ? "block" : "none",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "15px 25px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        zIndex: 1000, // Ensure the button is above other elements
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onClick={handleInstallClick}
    >
      Install the App
    </button>
  );
}