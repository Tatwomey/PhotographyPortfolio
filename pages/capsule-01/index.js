import { useEffect } from "react";
import Head from "next/head";

export default function CapsuleLanding() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];

    const handleKlaviyoFormEvent = (event) => {
      const detail = event?.detail || {};
      const eventType = detail?.type;

      if (eventType !== "submit") return;

      const formId = detail?.formId || detail?.formID || "SyxgXY";
      const metaData = detail?.metaData || {};

      const hasEmail = Boolean(metaData?.$email);
      const hasPhone = Boolean(
        metaData?.$phone_number || metaData?.phone_number,
      );

      window.dataLayer.push({
        event: "generate_lead",
        lead_type: "capsule_waitlist",
        page_type: "capsule_01",
        page_path: window.location.pathname,
        page_location: window.location.href,
        form_id: formId,
        email_opt_in: hasEmail,
        sms_opt_in: hasPhone,
      });

      console.log("[GTM] generate_lead pushed", {
        event: "generate_lead",
        lead_type: "capsule_waitlist",
        page_type: "capsule_01",
        page_path: window.location.pathname,
        page_location: window.location.href,
        form_id: formId,
        email_opt_in: hasEmail,
        sms_opt_in: hasPhone,
      });
    };

    window.addEventListener("klaviyoForms", handleKlaviyoFormEvent);

    return () => {
      window.removeEventListener("klaviyoForms", handleKlaviyoFormEvent);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Capsule 01 — Limited Edition Prints</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Join the drop list for early access to signed, limited-edition Trevor Twomey prints."
        />
      </Head>

      <main className="bg-white pt-[160px] sm:pt-[180px] px-4 pb-12 text-center flex flex-col items-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight text-black">
          Get notified when signed, limited-edition prints drop.
        </h1>

        <p className="text-sm text-gray-400 italic mt-2 mb-6">
          Preview the drop.
        </p>

        <div className="flex justify-center mb-8 overflow-x-auto no-scrollbar w-full">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="block w-[72px] aspect-[2/5] sm:w-[90px] mx-[2px] cursor-default pointer-events-none"
              style={{
                backgroundImage: `url(/capsule-01/sliver${num}.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              title={`Sliver ${num}`}
              aria-hidden="true"
            />
          ))}
        </div>

        <p className="text-base text-gray-700 max-w-xl mb-6">
          Join the drop list to unlock early access—and a shot at a signed
          16×20″ print from the vault.
        </p>

        <div className="w-full max-w-md mb-10">
          <div className="klaviyo-form-SyxgXY"></div>
        </div>

        <p className="text-xs text-gray-500 mt-8 max-w-md leading-relaxed">
          Msg &amp; data rates may apply. Unsubscribe anytime.
        </p>
      </main>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
