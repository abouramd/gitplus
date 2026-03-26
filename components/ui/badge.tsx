import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-ctp-mauve/15 text-ctp-mauve border-ctp-mauve/20 [a]:hover:bg-ctp-mauve/25",
        secondary:
          "bg-ctp-surface1/60 text-ctp-subtext1 [a]:hover:bg-ctp-surface1",
        destructive:
          "bg-ctp-red/15 text-ctp-red border-ctp-red/20 focus-visible:ring-ctp-red/20 [a]:hover:bg-ctp-red/25",
        outline:
          "border-ctp-surface1 text-ctp-text [a]:hover:bg-ctp-surface0 [a]:hover:text-ctp-subtext1",
        ghost:
          "hover:bg-ctp-surface0 hover:text-ctp-subtext1",
        link: "text-ctp-blue underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
