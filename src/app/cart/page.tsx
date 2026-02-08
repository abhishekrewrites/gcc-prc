"use client";

import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DiscountCode } from "@/components/DiscountCode";
import { SavedItems } from "@/components/SavedItems";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, discount } =
    useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const discountAmount = discount ? subtotal * discount.amount : 0;
  const total = subtotal - discountAmount;

  if (cart.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/">
          <Button className="text-lg px-8 py-2">Start Shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row gap-6 p-6 border rounded-lg bg-white "
            >
              <div className="relative h-32 w-32 shrink-0 bg-gray-50 rounded-md overflow-hidden self-center sm:self-start">
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex flex-col grow justify-between gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3
                      className="text-lg font-semibold line-clamp-2"
                      title={item.product.title}
                    >
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      {item.product.category}
                    </p>
                  </div>
                  <Button
                    onClick={() => removeFromCart(item.product.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="font-bold text-xl">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#f5f5f5] p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <DiscountCode />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({discount.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full text-lg py-6">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
      <SavedItems />
    </main>
  );
}
