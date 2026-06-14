import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const TOKEN_KEY = "flowmesh_token"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
