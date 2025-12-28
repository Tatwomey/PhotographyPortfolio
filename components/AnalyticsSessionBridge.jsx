// components/AnalyticsSessionBridge.jsx
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

function inferUserType(allowedPages = []) {
  const cleaned = allowedPages
    .filter((p) => typeof p === "string")
    .map((p) => p.trim())
    .filter(Boolean);

  return cleaned.some((p) => p.startsWith("/music/")) ? "band" : "public";
}

export default function AnalyticsSessionBridge() {
  const { data: session, status } = useSession();
  const lastPayloadRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];

    const isAuthed = status === "authenticated" && !!session?.user;
    const allowedPages = isAuthed ? session.user.allowedPages || [] : [];
    const userType = isAuthed ? inferUserType(allowedPages) : "public";

    const payload = {
      event: "user_context",
      user_type: userType,
      gated: userType === "band",
      user_id: null,
      allowed_pages_count: Array.isArray(allowedPages)
        ? allowedPages.length
        : 0,
    };

    const last = lastPayloadRef.current;
    const same =
      last &&
      last.user_type === payload.user_type &&
      last.gated === payload.gated &&
      last.allowed_pages_count === payload.allowed_pages_count;

    if (!same) {
      window.dataLayer.push(payload);
      lastPayloadRef.current = payload;
    }
  }, [session, status]);

  return null;
}
