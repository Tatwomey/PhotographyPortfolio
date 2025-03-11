import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  // Define when to show Terms & Privacy links
  const showLinks = router.pathname.startsWith("/shop");

  return (
    <footer className="bg-black text-white py-4 mt-12 text-center">
      &copy; 2025 Trevor Twomey Photography. All Rights Reserved. | Site Design by{" "}
      <a href="mailto:trevor.a.twomey@gmail.com" className="text-white hover:text-gray-300">
        Trevor Twomey
      </a>
      {showLinks && (
        <div className="mt-2">
          <Link href="/shop/terms" className="text-white hover:text-gray-300 mx-2">
            Terms of Service
          </Link>
          |
          <Link href="/shop/privacy" className="text-white hover:text-gray-300 mx-2">
            Privacy Policy
          </Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;
