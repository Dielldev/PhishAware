import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-[#47F3AB] border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  )
} 