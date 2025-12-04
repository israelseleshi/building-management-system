import * as React from "react"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`overflow-y-auto overflow-x-hidden ${className || ""}`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(107, 90, 70, 0.3) transparent",
      }}
      {...props}
    >
      {children}
    </div>
  )
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
