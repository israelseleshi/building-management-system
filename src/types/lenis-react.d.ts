declare module "lenis/react" {
  import type { FC, HTMLAttributes, ReactNode } from "react"

  export interface ReactLenisProps extends HTMLAttributes<HTMLElement> {
    root?: boolean
    options?: unknown
    children?: ReactNode
  }

  export const ReactLenis: FC<ReactLenisProps>
}
