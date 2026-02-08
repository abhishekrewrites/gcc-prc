"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const DiscountCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const applyDiscount = useCartStore((state) => state.applyDiscount);
  const discount = useCartStore((state) => state.discount);
  const removeDiscount = useCartStore((state) => state.removeDiscount);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    if (applyDiscount(code)) {
      setSuccess(`Coupon ${code} applied!`);
      setCode("");
    } else {
      setError("Invalid discount code");
    }
  };

  const handleRemove = () => {
    removeDiscount();
    setSuccess(null);
    setError(null);
  };

  if (discount) {
    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-green-700">
              Code: {discount.code}
            </span>
            <p className="text-sm text-green-600">
              {(discount.amount * 100).toFixed(0)}% Off Applied
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <Input
          type="text"
          placeholder="Discount code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-white"
        />
        <Button type="submit" variant="outline">
          Apply
        </Button>
      </form>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-1">{success}</p>}
    </div>
  );
};
