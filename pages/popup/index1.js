import Head from "next/head";
import Link from "next/link";

export default function Drop1Landing() {
  return (
    <>
      <Head>
        <title>Drop 1 — Limited Edition Prints</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          async
          type="text/javascript"
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=NEXT_PUBLIC_KLAVIYO_API_KEY"
        ></script>
      </Head>

      <main className="min-h-screen bg-white px-4 py-12 text-center flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
          Get notified when signed, limited-edition prints drop.
        </h1>
        <p className="text-base text-gray-700 max-w-xl mb-8">
          Every time a new release goes live, you’ll be the first to know—
          <br />
          and automatically entered to win a{" "}
          <strong>signed and numbered 16×20&quot; print</strong> from the vault.
        </p>

        {/* 🔥 Supreme-style vertical sliver grid (5 images) */}
        <div className="flex justify-center mb-10 overflow-x-auto no-scrollbar">
          {[
  { slug: "print-1", img: "/drop1/sliver1.png" },
  { slug: "print-2", img: "/drop1/sliver2.png" },
  { slug: "print-3", img: "/drop1/sliver3.png" },
  { slug: "print-4", img: "/drop1/sliver4.png" },
  { slug: "print-5", img: "/drop1/sliver5.png" },
]
.map(({ slug, img }, i) => (
<Link
  key={i}
  href={`/popup/${slug}`}
  className="relative w-[72px] aspect-[2/5] sm:w-[90px] mx-[2px] hover:opacity-80 transition-opacity"
  style={{
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
  title={`View ${slug}`}
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
          automatically entered to win a <strong>signed and numbered 16×20&quot; print</strong> from
          the vault. No bots. No mass runs. Just raw, unfiltered art for real
          collectors and fans. Msg &amp; data rates may apply. Unsubscribe
          anytime.
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
