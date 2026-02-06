import { cn } from "@/shared/utils/cn"
import { forwardRef } from "react"

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, ...props }, ref) => {
    const Tag = `h${level}` as const
    const baseStyles = "font-bold tracking-tight"
    
    const levelStyles = {
      1: "text-4xl md:text-5xl lg:text-6xl",
      2: "text-3xl md:text-4xl",
      3: "text-2xl md:text-3xl",
      4: "text-xl md:text-2xl",
      5: "text-lg md:text-xl",
      6: "text-base md:text-lg"
    }

    return (
      <Tag
        ref={ref}
        className={cn(baseStyles, levelStyles[level], className)}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "base" | "lg" | "xl"
  weight?: "light" | "normal" | "medium" | "semibold" | "bold"
  lead?: boolean
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size = "base", weight = "normal", lead = false, ...props }, ref) => {
    const baseStyles = "text-foreground"
    
    const sizeStyles = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl"
    }

    const weightStyles = {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    }

    return (
      <p
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          weightStyles[weight],
          lead && "text-xl leading-relaxed",
          className
        )}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export interface MutedTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

const MutedText = forwardRef<HTMLSpanElement, MutedTextProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
MutedText.displayName = "MutedText"

export interface LargeProps extends React.HTMLAttributes<HTMLDivElement> {}

const Large = forwardRef<HTMLDivElement, LargeProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-2xl font-bold", className)}
      {...props}
    />
  )
)
Large.displayName = "Large"

export interface SmallProps extends React.HTMLAttributes<HTMLDivElement> {}

const Small = forwardRef<HTMLDivElement, SmallProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
)
Small.displayName = "Small"

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

const Code = forwardRef<HTMLElement, CodeProps>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    />
  )
)
Code.displayName = "Code"

export { Heading, Text, MutedText, Large, Small, Code }
