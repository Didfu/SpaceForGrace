"use client";
import Link from "next/link";
import { Info } from "lucide-react";

export function AboutButton() {
  return (
    <div className="flex justify-center mt-6">
      <Link
        href="/about"
        className="inline-flex items-center gap-2 px-4 py-2 text-black bg-[#C7BDA2] rounded-full shadow-md hover:bg-opacity-90 transition-all duration-200"
      >
        <Info className="h-5 w-5" />
        <span className="font-medium">About</span>
      </Link>
    </div>
  );
}
