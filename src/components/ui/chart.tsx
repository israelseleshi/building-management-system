"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  )
}

const ChartContext = React.createContext<{
  config: ChartConfig
} | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        id={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick text]:fill-muted-foreground [&_.recharts-cartesian-axis-tick_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-default-tooltip]:!bg-background [&_.recharts-default-tooltip]:!border-border [&_.recharts-default-tooltip]:!rounded-md [&_.recharts-default-tooltip]:!shadow-md [&_.recharts-tooltip-wrapper]:!outline-none [&_.recharts-surface]:overflow-visible",
          className
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

type ChartTooltipProps = RechartsPrimitive.TooltipProps<number, string>

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    Pick<ChartTooltipProps, "active" | "payload" | "label" | "cursor"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      label,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      nameKey,
      labelKey,
      className,
      ...props
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.[0]) {
        return null
      }

      const item = payload[0]
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = config[key as keyof typeof config]

      const value =
        !labelKey && typeof label === "string"
          ? label
          : itemConfig?.label || key

      return value
    }, [config, hideLabel, label, labelKey, payload])

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...props}
      >
        {!hideLabel && tooltipLabel ? (
          <div className="text-muted-foreground">{tooltipLabel}</div>
        ) : null}
        {payload.map((item: any, index: number) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = config[key as keyof typeof config]
          const indicatorColor =
            itemConfig?.color || `var(--chart-${(index % 5) + 1})`

          return (
            <div
              key={`${item.dataKey}-${index}`}
              className="flex w-full flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5">
                {!hideIndicator && (
                  <div
                    className={cn("shrink-0 rounded-[2px] border border-[--color] bg-[--color]", {
                      "h-2 w-2": indicator === "dot",
                      "w-1": indicator === "line",
                      "rounded-[2px]": indicator === "dashed",
                    })}
                    style={
                      {
                        "--color": indicatorColor,
                      } as React.CSSProperties
                    }
                  />
                )}
                <span className="text-muted-foreground">
                  {itemConfig?.label || key}
                </span>
              </div>
              <span className="font-mono font-medium text-foreground">
                {typeof item.value === "string" && !isNaN(Number(item.value))
                  ? Number(item.value).toLocaleString()
                  : item.value?.toLocaleString?.() || item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartContext,
  useChart,
  type ChartConfig,
}
