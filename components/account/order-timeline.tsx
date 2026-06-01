import { Check } from "lucide-react";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const steps: { status: OrderStatus; label: string }[] = [
  { status: "PENDING", label: "Order Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

const statusOrder: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

interface OrderTimelineProps {
  status: OrderStatus;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";

  if (isCancelled) {
    return (
      <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
        Order {status.toLowerCase()}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const completed = i <= currentIndex;
          return (
            <div key={step.status} className="flex flex-1 flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  completed ? "bg-[#2563EB] text-white" : "bg-gray-200 text-gray-400"
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <p className={cn("mt-2 text-xs text-center", completed ? "text-[#111827]" : "text-gray-400")}>
                {step.label}
              </p>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute h-0.5 w-full top-4 -z-10",
                    i < currentIndex ? "bg-[#2563EB]" : "bg-gray-200"
                  )}
                  style={{ display: "none" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
