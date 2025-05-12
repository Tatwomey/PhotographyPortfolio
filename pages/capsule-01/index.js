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
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=NEXT_PUBLIC_KLAVIYO_API_KEY"
        ></script>
      </Head>

      <main className="bg-white pt-[160px] sm:pt-[180px] px-4 pb-12 text-center flex flex-col items-center min-h-screen">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight text-black">
          Get notified when signed, limited-edition prints drop.
        </h1>
        <p className="text-base text-gray-700 max-w-xl mb-8">
          Every time a new release goes live, you’ll be the first to know—
          <br />
          and automatically entered to win a <strong>signed and numbered 16×20" print</strong> from the vault.
        </p>

        {/* 🔥 Vertical Sliver Grid (not clickable) */}
        <div className="flex justify-center mb-10 overflow-x-auto no-scrollbar w-full">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className="block w-[72px] aspect-[2/5] sm:w-[90px] mx-[2px]"
              style={{
                backgroundImage: `url(/capsule-01/sliver${num}.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              title={`Sliver ${num}`}
            />
          ))}
        </div>

        {/* 📬 Klaviyo form embed */}
        <div className="w-full max-w-md">
          <div className="klaviyo-form-SyxgXY"></div>
        </div>

        {/* Legal/collector copy */}
        <p className="text-xs text-gray-500 mt-8 max-w-md leading-relaxed">
          Join the official drop list for Trevor Twomey Photography—where iconic
          moments in music are frozen, framed, and fiercely limited. With every
          exclusive release, you’ll be <strong>first to know</strong> and
          automatically entered to win a <strong>signed and numbered 16×20" print</strong> from
          the vault. No bots. No mass runs. Just raw, unfiltered art for real
          collectors and fans. Msg &amp; data rates may apply. Unsubscribe anytime.
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
