import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  // Light mode pages
  const isEcommercePage =
    router.pathname.startsWith("/shop") ||
    router.pathname.startsWith("/popup") ||
    router.pathname.startsWith("/capsule-01/");

  return (
    <footer
      className={`py-4 mt-12 text-center transition-colors duration-300 ${
        isEcommercePage ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      &copy; 2025 Trevor Twomey Photography. All Rights Reserved. | Site Design by{" "}
      <a
        href="mailto:trevor.a.twomey@gmail.com"
        className={
          isEcommercePage ? "text-black hover:text-gray-600" : "text-white hover:text-gray-300"
        }
      >
        Trevor Twomey
      </a>

      {isEcommercePage && (
        <div className="mt-2">
          <Link href="/shop/terms" className="mx-2 hover:underline">
            Terms of Service
          </Link>
          |
          <Link href="/shop/privacy" className="mx-2 hover:underline">
            Privacy Policy
          </Link>
          |
          <Link href="/returns-policy" className="mx-2 hover:underline">
            Returns & Exchanges
          </Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;
