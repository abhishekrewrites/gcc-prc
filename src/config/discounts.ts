export type DiscountType = "PERCENTAGE" | "FIXED";

export interface DiscountRule {
  amount: number;
  type: DiscountType;
}

export const DISCOUNTS: Record<string, DiscountRule> = {
  SAVE10: { amount: 0.1, type: "PERCENTAGE" },
  SAVE20: { amount: 0.2, type: "PERCENTAGE" },
  SUMMER50: { amount: 0.5, type: "PERCENTAGE" },
} as const;
