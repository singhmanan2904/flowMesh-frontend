"use client";

import { Check, Circle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ORDER_STAGES, getOrderProgress, type OrderStatus } from "@/lib/order";

type OrderStatusProgressProps = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusProgress({
  status,
  className,
}: OrderStatusProgressProps) {
  const { activeStep, completedSteps, failedStep, progressValue, statusLabel } =
    getOrderProgress(status);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{statusLabel}</p>
        <p className="text-xs text-muted-foreground">{progressValue}%</p>
      </div>

      <Progress
        value={progressValue}
        className={cn("h-2", failedStep !== null && "[&>div]:bg-destructive")}
      />

      <div className="grid grid-cols-4 gap-2">
        {ORDER_STAGES.map((stage, index) => {
          const isCompleted = index < completedSteps;
          const isActive = index === activeStep && failedStep === null;
          const isFailed = index === failedStep;

          return (
            <div key={stage.key} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-xs transition-colors",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isActive &&
                    "border-primary bg-primary/10 text-primary ring-2 ring-primary/20",
                  isFailed &&
                    "border-destructive bg-destructive/10 text-destructive",
                  !isCompleted &&
                    !isActive &&
                    !isFailed &&
                    "border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-3.5" />
                ) : isFailed ? (
                  <X className="size-3.5" />
                ) : (
                  <Circle className="size-2 fill-current" />
                )}
              </div>
              <span
                className={cn(
                  "text-center text-[11px] leading-tight",
                  isActive || isCompleted
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                  isFailed && "font-medium text-destructive"
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
