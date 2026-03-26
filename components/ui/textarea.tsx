import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-ctp-surface1 bg-ctp-mantle px-2.5 py-2 text-base text-ctp-text transition-[border-color,box-shadow] outline-none placeholder:text-ctp-overlay0 focus-visible:border-ctp-mauve focus-visible:ring-3 focus-visible:ring-ctp-mauve/20 focus-visible:shadow-[var(--shadow-glow-mauve)] disabled:cursor-not-allowed disabled:bg-ctp-surface0/50 disabled:opacity-50 aria-invalid:border-ctp-red aria-invalid:ring-3 aria-invalid:ring-ctp-red/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
