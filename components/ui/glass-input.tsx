"use client"

import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes } from "react"

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground/80 pl-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full px-5 py-3.5 rounded-2xl",
          "bg-white/60 backdrop-blur-sm",
          "border border-white/40",
          "text-foreground placeholder:text-muted-foreground/60",
          "focus:outline-none focus:ring-2 focus:ring-[#ff9a7b]/40 focus:border-transparent",
          "transition-all duration-200",
          "hover:bg-white/70",
          error && "border-red-400 focus:ring-red-400/40",
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500 pl-1">{error}</p>}
    </div>
  )
})
GlassInput.displayName = "GlassInput"

export { GlassInput }
