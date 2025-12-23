// pages/login.js
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const ANALYTICS_SALT = process.env.NEXT_PUBLIC_ANALYTICS_SALT;

async function sha256Hex(input) {
  // Browser-only. This runs inside handleLogin (client-side).
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function inferUserTypeFromAllowedPages(allowedPages) {
  const hasGatedMusic = allowedPages.some(
    (p) => typeof p === "string" && p.startsWith("/music/")
  );
  return hasGatedMusic ? "band" : "public";
}

function setGAUserContext({ userId, userType }) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA_ID, {
    user_id: userId,
    user_properties: {
      user_type: userType,
    },
  });
}

function trackGAEvent(name, params = {}) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

// SSR: if already logged in and you hit /login, redirect away
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    const rawPages = session?.user?.allowedPages ?? [];

    const allowedPages = rawPages
      .filter((p) => typeof p === "string")
      .map((p) => p.trim())
      .filter(Boolean);

    const callbackUrl = (context.query && context.query.callbackUrl) || null;

    const preferred = "/music/iamx25";
    let target = preferred;

    if (
      callbackUrl &&
      typeof callbackUrl === "string" &&
      allowedPages.includes(callbackUrl)
    ) {
      target = callbackUrl;
    } else if (!allowedPages.includes(preferred) && allowedPages.length > 0) {
      target = allowedPages[0];
    }

    return {
      redirect: {
        destination: target || "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const callbackUrl = (router.query && router.query.callbackUrl) || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
      ...(callbackUrl ? { callbackUrl } : {}),
    });

    if (result?.error) {
      setError("You fucked up.");
      return;
    }

    const session = await getSession();
    console.log("🔐 Session after login:", session);

    const rawPages = session?.user?.allowedPages ?? [];
    const allowedPages = rawPages
      .filter((p) => typeof p === "string")
      .map((p) => p.trim())
      .filter(Boolean);

    const userType = inferUserTypeFromAllowedPages(allowedPages);

    // ---- Analytics: set user context (no dependency)
    const salt = ANALYTICS_SALT || "CHANGE_ME_SET_NEXT_PUBLIC_ANALYTICS_SALT";
    const hashedUserId = await sha256Hex(`${username}:${salt}`);

    setGAUserContext({ userId: hashedUserId, userType });
    trackGAEvent("login_success", {
      user_type: userType,
      gated: userType === "band",
    });

    // Redirect
    const preferred = "/music/iamx25";
    let target = preferred;

    if (
      callbackUrl &&
      typeof callbackUrl === "string" &&
      allowedPages.includes(callbackUrl)
    ) {
      target = callbackUrl;
    } else if (!allowedPages.includes(preferred) && allowedPages.length > 0) {
      target = allowedPages[0];
    }

    router.push(target);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="bg-black p-6 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-xl font-bold text-white text-center mb-4 bg-black p-2 rounded">
          Client Login
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-600 bg-white text-black rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-600 bg-white text-black rounded"
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded border border-gray-600 hover:bg-gray-900 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
