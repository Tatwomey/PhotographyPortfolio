import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useRouter } from "next/router";
import CartIcon from "./CartIcon";
import { useCurrency } from "@/contexts/CurrencyContext";
import CurrencySwitcher from "./CurrencySwitcher";
import { useSession, signOut } from "next-auth/react";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

function clearGAUserContextAndTrackLogout({ userType = "band" } = {}) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;

  // Clear user identity + reset to public
  window.gtag("config", GA_ID, {
    user_id: null,
    user_properties: { user_type: "public" },
  });

  // Track logout event
  window.gtag("event", "logout", { user_type: userType });
}

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: "transparent",
    color: "white",
  });

  const router = useRouter();
  const { data: session, status } = useSession();

  const { currency } = useCurrency();

  const isLightModePage =
    router.pathname.startsWith("/shop") ||
    router.pathname.startsWith("/popup") ||
    router.pathname.startsWith("/capsule-01");

  const showCommerceControls =
    router.pathname.startsWith("/shop") || router.pathname.startsWith("/popup");

  // Gated rule: only show avatar on authenticated /music/* pages
  const isGatedRoute = router.pathname.startsWith("/music/");
  const isAuthenticated = status === "authenticated";
  const showClientAvatar = isGatedRoute && isAuthenticated;

  const displayName =
    session?.user?.name ||
    session?.user?.username ||
    session?.user?.email?.split?.("@")?.[0] ||
    "there";

  // Avatar menu state (works for desktop + mobile)
  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const clientMenuRef = useRef(null);

  // Close avatar menu when clicking/tapping outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (!clientMenuRef.current) return;
      if (!clientMenuRef.current.contains(e.target)) {
        setClientMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  // Navbar color behavior
  useEffect(() => {
    if (isLightModePage) {
      setNavbarStyle({ backgroundColor: "white", color: "black" });
      return;
    }

    const changeColor = () => {
      if (window.scrollY >= 90) {
        setNavbarStyle({ backgroundColor: "black", color: "white" });
      } else {
        setNavbarStyle({ backgroundColor: "transparent", color: "white" });
      }
    };

    window.addEventListener("scroll", changeColor);
    return () => window.removeEventListener("scroll", changeColor);
  }, [isLightModePage]);

  const handleNav = () => setNav(!nav);
  const closeNav = () => setNav(false);

  const handleAvatarToggle = () => {
    setClientMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    // analytics cleanup
    clearGAUserContextAndTrackLogout({ userType: "band" });

    // close menu immediately for snappy UX
    setClientMenuOpen(false);

    // sign out + return home
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div
      style={{
        backgroundColor: nav ? "black" : navbarStyle.backgroundColor,
        transition: "background-color 0.3s ease",
      }}
      className="fixed left-0 top-0 w-full z-50 transition-opacity duration-300 opacity-100">
      <div className="max-w-[1280px] m-auto flex justify-between items-center py-4 px-4">
        <Link href="/#home" onClick={closeNav}>
          <Image
            src={
              isLightModePage
                ? "/Watermarklogo_bw.png"
                : "/Watermarklogo_2025.png"
            }
            alt="Logo"
            width={374}
            height={374}
            className="navbar-logo transition-all duration-500 ease-in-out"
            style={{ cursor: "pointer" }}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-4 items-center">
          {[
            { href: "/#home", label: "Home" },
            { href: "/about#about", label: "About" },
            { href: "/music#music-photography", label: "Music" },
            { href: "/contact#work-with-me", label: "Let's talk" },
            { href: "/shop#shop", label: "Shop" },
          ].map(({ href, label }) => (
            <Link key={label} href={href} onClick={closeNav}>
              <span
                className={`text-sm font-medium ${
                  isLightModePage ? "text-black" : "text-white"
                }`}>
                {label}
              </span>
            </Link>
          ))}

          <div className="flex space-x-2 items-center">
            <a
              href="https://www.instagram.com/trevortwomey/"
              target="_blank"
              rel="noopener noreferrer">
              <FaInstagram
                size={20}
                className={`cursor-pointer ${
                  isLightModePage ? "text-black" : "text-white"
                }`}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/trevor-twomey"
              target="_blank"
              rel="noopener noreferrer">
              <FaLinkedin
                size={20}
                className={`cursor-pointer ${
                  isLightModePage ? "text-black" : "text-white"
                }`}
              />
            </a>
          </div>
        </div>

        {/* Right-side icons (Avatar + Separator + Cart + Mobile Menu Toggle) */}
        <div className="flex items-center gap-3">
          {/* Client Avatar (GATED ONLY) */}
          {showClientAvatar && (
            <div className="relative" ref={clientMenuRef}>
              <button
                type="button"
                onClick={handleAvatarToggle}
                className="group relative flex items-center justify-center"
                aria-haspopup="menu"
                aria-expanded={clientMenuOpen ? "true" : "false"}
                aria-label="Client menu">
                <HiOutlineUserCircle
                  size={26}
                  className={`transition-opacity duration-200 ${
                    isLightModePage
                      ? "text-black opacity-80 hover:opacity-100"
                      : "text-white opacity-80 hover:opacity-100"
                  }`}
                />

                {/* Desktop hover tooltip (subtle) */}
                <div
                  className={`hidden md:block absolute right-0 top-full mt-2 whitespace-nowrap rounded px-2 py-1 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-100 ${
                    isLightModePage
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}>
                  Hello {displayName}
                </div>
              </button>

              {/* Click/tap menu (desktop + mobile) */}
              {clientMenuOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-52 rounded-lg shadow-xl border ${
                    isLightModePage
                      ? "bg-white border-black/10"
                      : "bg-black border-white/10"
                  }`}
                  role="menu">
                  <div
                    className={`px-3 py-2 text-xs ${
                      isLightModePage ? "text-black/70" : "text-white/70"
                    }`}>
                    Hello {displayName}
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={`w-full text-left px-3 py-2 text-sm transition ${
                      isLightModePage
                        ? "text-black hover:bg-black/5"
                        : "text-white hover:bg-white/10"
                    }`}
                    role="menuitem">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tiny separator (desktop-only for a clean look; remove `hidden md:block` if you want it on mobile too) */}
          {showClientAvatar && (
            <div
              className={`hidden md:block h-4 w-px ${
                isLightModePage ? "bg-black/20" : "bg-white/20"
              }`}
            />
          )}
          {/* Commerce Controls (Shop / Popup only) */}
          {showCommerceControls && typeof window !== "undefined" && (
            <div className="hidden md:flex items-center gap-4">
              {/* Only show currency switcher if NOT USD */}
              {currency !== "USD" && (
                <>
                  <CurrencySwitcher isDarkMode={!isLightModePage} />

                  {/* Separator */}
                  <div
                    className={`h-4 w-px ${
                      isLightModePage ? "bg-black/20" : "bg-white/20"
                    }`}
                  />
                </>
              )}

              {/* Cart */}
              <CartIcon isDarkMode={!isLightModePage} />
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div
            onClick={handleNav}
            className="block md:hidden z-50 cursor-pointer">
            {nav ? (
              <AiOutlineClose
                size={30}
                className={isLightModePage ? "text-black" : "text-white"}
              />
            ) : (
              <AiOutlineMenu
                size={30}
                className={isLightModePage ? "text-black" : "text-white"}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {nav && (
        <div
          className={`md:hidden py-4 ${
            isLightModePage ? "bg-white" : "bg-black"
          }`}>
          <ul
            className={`flex flex-col space-y-4 px-6 text-lg ${
              isLightModePage ? "text-black" : "text-white"
            }`}>
            <li onClick={closeNav}>
              <Link href="/#home">Home</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/about#about">About</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/music#music-photography">Music</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/contact#work-with-me">Let&apos;s talk</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/shop#shop">Shop</Link>
            </li>

            {/* Mobile-only sign out inside hamburger menu when gated */}
            {showClientAvatar && (
              <li
                className={`pt-2 border-t ${
                  isLightModePage ? "border-black/10" : "border-white/10"
                }`}>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-left w-full">
                  Sign out
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
