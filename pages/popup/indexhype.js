import Head from "next/head";

export default function PopupHype() {
  return (
    <>
      <Head>
        <title>Popup Closed – Join the Drop List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
        {/* Klaviyo script */}
        <script
          async
          type="text/javascript"
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=NEXT_PUBLIC_KLAVIYO_API_KEY"
        ></script>
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-12 text-center">
        <h1
          className="text-4xl md:text-5xl font-serif mb-2 font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Popup Closed
        </h1>
        <p className="text-sm uppercase tracking-wide mb-4 text-gray-600">
          Join the drop list for early access
        </p>

        <p className="text-base text-gray-700 max-w-md mb-6">
          Get notified when signed, limited-edition prints drop. Every time a
          new release goes live, you’ll be the first to know—and automatically
          entered to win a <strong>signed and numbered 16×20&quot; print</strong> from the
          vault.
        </p>

        <div className="w-full max-w-md">
          {/* Embed Klaviyo Form */}
          <div className="klaviyo-form-SyxgXY"></div>
        </div>

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
    </>
  );
}
