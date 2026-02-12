import React, { useRef, useEffect, useMemo } from "react";
import { useShopContext } from "/contexts/shopContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

function formatMoney(amount, currencyCode) {
  const n = Number.parseFloat(amount ?? "0");
  const safe = Number.isFinite(n) ? n : 0;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe);
  } catch {
    return `${currencyCode || "USD"} ${safe.toFixed(2)}`;
  }
}

const CartPage = () => {
  const { cart, handleRemoveFromCart } = useShopContext();
  const { currency } = useCurrency();

  const safeCart =
    cart && cart.lines && cart.lines.edges ? cart.lines.edges : [];

  const cartPageRef = useRef(null);
  const checkoutRef = useRef(null);
  const router = useRouter();

  useSmoothScroll("#shopping-cart", cartPageRef);

  useEffect(() => {
    if (router.query.scrollToCart === "true" && cartPageRef.current) {
      cartPageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [router.query]);

  const subtotalData = useMemo(() => {
    let total = 0;
    let detectedCurrency = currency || "USD";

    safeCart.forEach(({ node: item }) => {
      const amount = parseFloat(item.merchandise?.priceV2?.amount ?? "0");
      const code = item.merchandise?.priceV2?.currencyCode ?? currency ?? "USD";

      detectedCurrency = code;
      total += amount * item.quantity;
    });

    return {
      amount: total.toFixed(2),
      currencyCode: detectedCurrency,
    };
  }, [safeCart, currency]);

  return (
    <div>
      <Hero />

      <div className="container mx-auto mt-10 cart-page">
        <div className="sm:flex shadow-md my-10">
          <div
            id="shopping-cart"
            ref={cartPageRef}
            className="w-full bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl text-black">
                Shopping Cart
              </h1>
              <h2 className="font-semibold text-2xl text-color-brown">
                {safeCart.length} Items
              </h2>
            </div>

            {safeCart.length === 0 ? (
              <p className="text-center text-color-brown">
                Your cart is empty.
              </p>
            ) : (
              safeCart.map(({ node: item }) => {
                const merchandise = item.merchandise;
                const product = merchandise.product;
                const imageSrc =
                  product?.images?.edges?.[0]?.node?.src ||
                  "/fallback-image.jpg";

                const unitAmount = merchandise?.priceV2?.amount ?? "0";
                const unitCurrency =
                  merchandise?.priceV2?.currencyCode ?? currency ?? "USD";

                const lineTotal = (
                  parseFloat(unitAmount) * item.quantity
                ).toFixed(2);

                return (
                  <div
                    key={item.id}
                    className="md:flex items-stretch py-8 border-t border-gray-50">
                    <div className="md:w-4/12 w-full">
                      <Image
                        src={imageSrc}
                        alt={product?.title || "Product Image"}
                        className="h-full object-contain"
                        width={100}
                        height={100}
                      />
                    </div>

                    <div className="md:pl-3 md:w-8/12 flex flex-col justify-center">
                      <p className="text-xs text-gray-800">{merchandise.sku}</p>

                      <div className="flex items-center justify-between w-full">
                        <p className="text-base font-black text-black">
                          {product?.title || "Product Title"}
                        </p>
                      </div>

                      <p className="text-xs text-gray-600 pt-2">
                        Price: {formatMoney(unitAmount, unitCurrency)}
                      </p>

                      <p className="text-xs text-gray-600 py-4">
                        Quantity: {item.quantity}
                      </p>

                      <div className="flex items-center justify-between pt-5">
                        <div>
                          <p
                            className="text-xs underline text-red-500 cursor-pointer"
                            onClick={() => handleRemoveFromCart(item)}>
                            Remove
                          </p>
                        </div>

                        <p className="text-base font-black text-color-brown">
                          {formatMoney(lineTotal, unitCurrency)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div className="flex justify-between mt-6">
              {cart && cart.checkoutUrl && (
                <Link href={cart.checkoutUrl} passHref>
                  <button
                    className="checkout-button block mb-4"
                    id="checkout"
                    ref={checkoutRef}>
                    Checkout Now
                  </button>
                </Link>
              )}

              <Link href="/popup" passHref>
                <button className="continue-shopping-btn block mb-4">
                  Keep Shopping
                </button>
              </Link>
            </div>

            <div className="flex justify-between mt-6">
              <p className="text-lg font-semibold">
                Subtotal:{" "}
                {formatMoney(subtotalData.amount, subtotalData.currencyCode)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
