// import { Link as LinkPrimitive } from "react-aria-components"
import { Link as RouterLink } from "@tanstack/react-router";
import type { LinkComponentProps } from "@tanstack/react-router";
import { cx } from "~/lib/primitive"


const Link = ({ className, ref, ...props }: LinkComponentProps) => {
  return (
    <RouterLink
      ref={ref}

      className={
        className}
      {...props}
    />
  )
}

export type { LinkComponentProps as LinkProps }
export { Link }
