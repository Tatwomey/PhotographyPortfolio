// components/Cart.jsx
import React from "react";
import { useShopContext } from "@/contexts/shopContext";
import Image from "next/image";

export default function Cart() {
  const { cart, handleRemoveFromCart, isCartOpen, toggleCart } =
    useShopContext();

  const edges = cart?.lines?.edges || [];
  const checkoutUrl = cart?.checkoutUrl || "";

  return (
    <div
      className={`drawer fixed top-0 right-0 w-full sm:w-96 h-full bg-white text-black shadow-xl transform transition-transform duration-300 z-50 ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}>
      {/* Close Button */}
      <button
        className="p-4 text-xl sm:text-2xl absolute top-0 right-0 z-10"
        onClick={toggleCart}
        type="button"
        aria-label="Close cart">
        &times;
      </button>

      <div className="p-4 pt-16 sm:pt-20">
        <h3 className="text-xl sm:text-2xl mb-4 font-bold">Your Cart</h3>

        {edges.length ? (
          <>
            <ul className="divide-y divide-gray-200">
              {edges.map(({ node: item }) => (
                <li key={item.id} className="flex items-center py-4">
                  <Image
                    src={item.merchandise.product.images.edges[0]?.node?.src}
                    alt={item.merchandise.product.title}
                    width={60}
                    height={60}
                    className="mr-4 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base">
                      {item.merchandise.product.title}
                    </p>
                    <p>
                      ${parseFloat(item.merchandise.priceV2.amount).toFixed(2)}
                    </p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                  </div>

                  <button
                    className="text-red-600 text-sm ml-2 sm:ml-4"
                    onClick={() => handleRemoveFromCart(item)}
                    type="button">
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <a
              className={`block w-full mt-6 transition text-black text-center py-3 rounded font-semibold ${
                checkoutUrl
                  ? "bg-yellow-400 hover:bg-yellow-300"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
              href={checkoutUrl || "#"}
              onClick={(e) => {
                if (!checkoutUrl) e.preventDefault();
              }}>
              Checkout
            </a>
          </>
        ) : (
          <p className="text-center mt-10 text-gray-600">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
