import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanTitle(title: string): string {
  if (!title) return "";
  
  // Remove markdown links like [Text](URL) -> Text
  let cleaned = title.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  
  // Remove common Amazon scrape junk
  cleaned = cleaned.replace(/Keyboard shortcut\s+shift\+alt\+opt\+D/gi, "");
  cleaned = cleaned.replace(/\[Product summary presents key product information\]/gi, "");
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  // Limit length
  if (cleaned.length > 80) {
    cleaned = cleaned.substring(0, 80) + "...";
  }
  
  return cleaned;
}
