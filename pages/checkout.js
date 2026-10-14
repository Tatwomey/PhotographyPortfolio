import { useEffect, useRef } from "react";
import Link from "next/link";
import { useShopContext } from "@/contexts/shopContext";

export default function CheckoutPage() {
  const { cart, loading, beginCheckout } = useShopContext();
  const started = useRef(false);
  useEffect(() => {
    if (!loading && cart?.lines?.edges?.length && !started.current) {
      started.current = true;
      beginCheckout();
    }
  }, [cart, loading, beginCheckout]);
  return <main className="pt-40 p-8 text-center">
    <h1>Checkout</h1>
    <button disabled={loading || !cart?.lines?.edges?.length} onClick={() => beginCheckout()}>Continue to secure checkout</button>
    <p><Link href="/cart">Return to your cart</Link></p>
  </main>;
}
