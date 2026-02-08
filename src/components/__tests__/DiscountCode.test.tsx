import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DiscountCode } from "../DiscountCode";
import { useCartStore } from "@/store/useCartStore";

// Mock the store
vi.mock("@/store/useCartStore", () => ({
  useCartStore: vi.fn(),
}));

describe("DiscountCode", () => {
  const mockApplyDiscount = vi.fn();
  const mockRemoveDiscount = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default store state
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          discount: null,
          applyDiscount: (code: string) => {
            mockApplyDiscount(code);
            return code === "SAVE10"; // Return true only for SAVE10
          },
          removeDiscount: mockRemoveDiscount,
        }),
    );
  });

  it("renders input and apply button initially", () => {
    render(<DiscountCode />);
    expect(screen.getByPlaceholderText(/discount code/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  it("shows error for empty code", () => {
    render(<DiscountCode />);
    fireEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(screen.getByText(/please enter a code/i)).toBeInTheDocument();
    expect(mockApplyDiscount).not.toHaveBeenCalled();
  });

  it("shows error for invalid code", () => {
    render(<DiscountCode />);
    const input = screen.getByPlaceholderText(/discount code/i);
    fireEvent.change(input, { target: { value: "INVALID" } });
    fireEvent.click(screen.getByRole("button", { name: /apply/i }));
    expect(screen.getByText(/invalid discount code/i)).toBeInTheDocument();
    expect(mockApplyDiscount).toHaveBeenCalledWith("INVALID");
  });

  it("applies valid code SAVE10", () => {
    render(<DiscountCode />);
    const input = screen.getByPlaceholderText(/discount code/i);
    fireEvent.change(input, { target: { value: "SAVE10" } });
    fireEvent.click(screen.getByRole("button", { name: /apply/i }));

    expect(mockApplyDiscount).toHaveBeenCalledWith("SAVE10");
    expect(screen.getByText(/coupon SAVE10 applied!/i)).toBeInTheDocument();
  });

  it("displays applied discount and allows removal", () => {
    // Mock store with active discount
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector) =>
        selector({
          discount: { code: "SAVE20", amount: 0.2 },
          applyDiscount: (code: string) => {
            mockApplyDiscount(code);
            return true;
          },
          removeDiscount: mockRemoveDiscount,
        }),
    );

    render(<DiscountCode />);

    expect(screen.getByText("Code: SAVE20")).toBeInTheDocument();
    expect(screen.getByText("20% Off Applied")).toBeInTheDocument();

    // Check if input is gone (optional based on your implementation, but in the code it returns early)
    expect(
      screen.queryByPlaceholderText(/discount code/i),
    ).not.toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: /remove/i });
    fireEvent.click(removeBtn);

    expect(mockRemoveDiscount).toHaveBeenCalled();
  });
});
