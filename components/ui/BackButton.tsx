"use client"; // ✅ Must be a Client Component

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")} // 🔹 Redirects to homepage
      className="flex items-center gap-2 px-4 py-2 text-black bg-[#C7BDA2FF] rounded-full shadow-md hover:bg-opacity-90 transition-all duration-200"
    >
      <ArrowLeft className="h-5 w-5" />
      <span className="font-medium">Home</span> {/* Adds "Home" text */}
    </button>
  );
}
