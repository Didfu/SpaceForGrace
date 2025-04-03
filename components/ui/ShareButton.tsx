"use client";

import { ShareIcon } from "@heroicons/react/24/outline"; // Update the import path for Heroicons v2
interface ShareButtonProps {
  title: string;
  url: string;
  image?: string; // Optional image URL
  type?: string;  // Optional type (e.g., "article")
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, url, image, type = "article" }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title,
          text: `${title}`,
          url,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 text-black bg-[#C7BDA2FF] rounded-full shadow-md hover:bg-opacity-90 transition-all duration-200"
      onClick={handleShare}
    >
      <ShareIcon className="w-5 h-5 text-black" /> {/* Add the share icon */}
      Share
    </button>
  );
};