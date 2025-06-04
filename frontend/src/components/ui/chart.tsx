import { ReactElement } from "react";
import { TooltipProps, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartContainerProps {
  children: ReactElement;
  config: Record<string, { label: string; color: string }>;
  className?: string;
}

export function ChartContainer({
  children,
  className,
}: ChartContainerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      {children}
    </ResponsiveContainer>
  );
}

export function ChartTooltip(props: TooltipProps<any, any>) {
  return <Tooltip {...props} />;
}

interface ChartTooltipContentProps {
  hideLabel?: boolean;
}

export function ChartTooltipContent({
  hideLabel,
  ...props
}: ChartTooltipContentProps & any) {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          {!hideLabel && <div className="font-medium">{label}</div>}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function ChartLegend(props: any) {
  return <Legend {...props} />;
}

interface ChartLegendContentProps {
  nameKey: string;
}

export function ChartLegendContent({
  nameKey,
  ...props
}: ChartLegendContentProps & any) {
  const { payload } = props;
  return (
    <div className="flex items-center gap-2">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry[nameKey]}</span>
        </div>
      ))}
    </div>
  );
}
