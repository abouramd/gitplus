import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-ctp-surface1 bg-ctp-mantle px-2.5 py-1 text-base text-ctp-text transition-[border-color,box-shadow] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ctp-subtext1 placeholder:text-ctp-overlay0 focus-visible:border-ctp-mauve focus-visible:ring-3 focus-visible:ring-ctp-mauve/20 focus-visible:shadow-[var(--shadow-glow-mauve)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-ctp-surface0/50 disabled:opacity-50 aria-invalid:border-ctp-red aria-invalid:ring-3 aria-invalid:ring-ctp-red/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
