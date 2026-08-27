import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines conditional CSS classes using `clsx` and resolves Tailwind CSS class conflicts using `twMerge`.
 *
 * @param inputs - List of class values, objects, or arrays to merge.
 * @returns Optimized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

