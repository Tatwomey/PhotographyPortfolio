import Head from "next/head";
import Image from "next/image";

export default function CapsuleLanding() {
  return (
    <>
      <Head>
        <title>Capsule 01 — Limited Edition Prints</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          async
          type="text/javascript"
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=RagX9z"
        ></script>
      </Head>

      <main className="bg-white pt-[160px] sm:pt-[180px] px-4 pb-12 text-center flex flex-col items-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight text-black">
          Get notified when signed, limited-edition prints drop.
        </h1>

        <p className="text-sm text-gray-400 italic mt-2 mb-6">Preview the drop.</p>

        {/* 🔥 Vertical Sliver Grid (not clickable) */}
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
            />
          ))}
        </div>

        <p className="text-base text-gray-700 max-w-xl mb-6">
          Join the drop list to unlock early access—and a shot at a signed 16×20″ print from the vault.
        </p>

        {/* 📬 Klaviyo form embed */}
        <div className="w-full max-w-md mb-10">
          <div className="klaviyo-form-SyxgXY"></div>
        </div>

        {/* Legal/collector copy (part of Klaviyo form or optional footer) */}
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
