export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_COMPLETED"
  | "PAYMENT_FAILED"
  | "SHIPPING_PENDING"
  | "SHIPPING_COMPLETED"
  | "SHIPPING_FAILED"
  | "COMPLETED";

export type Order = {
  id: string;
  products: string[];
  totalAmount: number;
  userId: string;
  status: OrderStatus;
};

export const ORDER_STAGES = [
  { key: "payment", label: "Payment" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

export type OrderProgress = {
  activeStep: number;
  completedSteps: number;
  failedStep: number | null;
  progressValue: number;
  statusLabel: string;
};

export function getOrderProgress(status: OrderStatus): OrderProgress {
  switch (status) {
    case "PAYMENT_PENDING":
      return {
        activeStep: 0,
        completedSteps: 0,
        failedStep: null,
        progressValue: 12,
        statusLabel: "Awaiting payment",
      };
    case "PAYMENT_FAILED":
      return {
        activeStep: 0,
        completedSteps: 0,
        failedStep: 0,
        progressValue: 0,
        statusLabel: "Payment failed",
      };
    case "PAYMENT_COMPLETED":
      return {
        activeStep: 1,
        completedSteps: 1,
        failedStep: null,
        progressValue: 37,
        statusLabel: "Payment confirmed",
      };
    case "SHIPPING_PENDING":
      return {
        activeStep: 2,
        completedSteps: 2,
        failedStep: null,
        progressValue: 62,
        statusLabel: "Preparing shipment",
      };
    case "SHIPPING_FAILED":
      return {
        activeStep: 2,
        completedSteps: 2,
        failedStep: 2,
        progressValue: 50,
        statusLabel: "Shipment failed",
      };
    case "SHIPPING_COMPLETED":
      return {
        activeStep: 3,
        completedSteps: 3,
        failedStep: null,
        progressValue: 87,
        statusLabel: "Out for delivery",
      };
    case "COMPLETED":
      return {
        activeStep: 3,
        completedSteps: 4,
        failedStep: null,
        progressValue: 100,
        statusLabel: "Delivered",
      };
  }
}

export const formatOrderStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export function getOrderStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "COMPLETED" || status.includes("COMPLETED")) {
    return "default";
  }
  if (status.includes("FAILED")) {
    return "destructive";
  }
  if (status.includes("PENDING")) {
    return "secondary";
  }
  return "outline";
}

export function shouldDisplayOrderStatus(status: string) {
  return status !== "PAYMENT_PENDING";
}
