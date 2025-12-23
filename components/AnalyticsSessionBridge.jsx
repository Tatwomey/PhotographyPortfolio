// components/AnalyticsSessionBridge.jsx
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function inferUserType(allowedPages = []) {
  const cleaned = allowedPages
    .filter((p) => typeof p === "string")
    .map((p) => p.trim())
    .filter(Boolean);

  return cleaned.some((p) => p.startsWith("/music/")) ? "band" : "public";
}

// Best-effort: ensure GTM has initialized before we push context
function waitForGTM(maxWaitMs = 1500, intervalMs = 50) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    const start = Date.now();
    const tick = () => {
      const ready =
        !!window.google_tag_manager || // GTM object exists
        (Array.isArray(window.dataLayer) && window.dataLayer.length > 0); // dataLayer exists + active

      if (ready) return resolve(true);
      if (Date.now() - start >= maxWaitMs) return resolve(false);

      setTimeout(tick, intervalMs);
    };

    tick();
  });
}

export default function AnalyticsSessionBridge() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];

    const run = async () => {
      // Wait briefly so early context doesn’t fire before GTM is ready
      await waitForGTM();

      const path = router?.pathname || "";
      const pageIsGated = path.startsWith("/music/");

      if (status !== "authenticated" || !session?.user) {
        window.dataLayer.push({
          event: "user_context",
          user_type: "public",
          gated: false, // user-level gated access
          page_is_gated: pageIsGated, // page-level gatedness
          user_id: null, // no PII
          allowed_pages_count: 0,
        });
        return;
      }

      const allowedPages = session?.user?.allowedPages || [];
      const userType = inferUserType(allowedPages);
      const userIsGated = userType === "band";

      window.dataLayer.push({
        event: "user_context",
        user_type: userType,
        gated: userIsGated,
        page_is_gated: pageIsGated,
        user_id: null,
        allowed_pages_count: Array.isArray(allowedPages)
          ? allowedPages.length
          : 0,
      });
    };

    run();
  }, [session, status, router.pathname]);

  return null;
}
