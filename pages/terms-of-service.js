import React, { useEffect } from "react";

const TermsOfService = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="container mx-auto pt-[140px] pb-12 px-4 md:px-8 max-w-3xl text-sm text-gray-800">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight text-black">
        Terms of Service
      </h1>

      <p className="mb-6 text-gray-500">Effective Date: May 7, 2026</p>

      <p className="leading-relaxed mb-4">
        These Terms of Service govern your use of the Trevor Twomey Photography
        website, including browsing the site, joining email or SMS lists,
        contacting us, and purchasing photography prints or related products. By
        using this website, you agree to these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Use of This Website
      </h2>

      <p className="leading-relaxed mb-4">
        You agree to use this website only for lawful purposes. You may not use
        the site in a way that interferes with its operation, attempts to gain
        unauthorized access to systems, or infringes the rights of Trevor Twomey
        Photography or any third party.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Intellectual Property
      </h2>

      <p className="leading-relaxed mb-4">
        All photographs, images, designs, text, graphics, logos, branding, and
        other content on this website are owned by Trevor Twomey Photography
        unless otherwise stated. They are protected by copyright and other
        intellectual property laws.
      </p>

      <p className="leading-relaxed mb-4">
        You may not copy, download, reproduce, screenshot for commercial use,
        distribute, modify, sell, license, mint, train artificial intelligence
        systems on, or otherwise exploit any photograph or website content
        without prior written permission from Trevor Twomey Photography.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Print Sales and Limited Editions
      </h2>

      <p className="leading-relaxed mb-4">
        Photography prints may be offered as open editions, limited editions,
        signed editions, numbered editions, or special releases. Product
        details, edition size, dimensions, paper type, price, and availability
        are listed on the applicable product page when available.
      </p>

      <p className="leading-relaxed mb-4">
        Limited-edition prints are available only while supplies last. Once a
        limited edition sells out, Trevor Twomey Photography is not obligated to
        produce additional prints from that edition.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Orders, Pricing, and Availability
      </h2>

      <p className="leading-relaxed mb-4">
        Prices and availability may change without notice. We reserve the right
        to correct errors, cancel orders affected by pricing or inventory
        mistakes, refuse orders, or limit quantities at our discretion.
      </p>

      <p className="leading-relaxed mb-4">
        Your order is not confirmed until checkout is completed and payment is
        successfully processed.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">Shipping</h2>

      <p className="leading-relaxed mb-4">
        Shipping timelines are estimates and may vary based on production time,
        carrier delays, destination, customs processing, weather, or other
        factors outside our control.
      </p>

      <p className="leading-relaxed mb-4">
        Buyers are responsible for providing accurate shipping information.
        International customers may be responsible for customs duties, taxes,
        import fees, or other charges imposed by their country.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Returns, Refunds, and Damaged Goods
      </h2>

      <p className="leading-relaxed mb-4">
        Because photography prints may be limited, made to order, signed,
        numbered, or carefully produced for each release, all sales may be final
        unless otherwise stated on the product page.
      </p>

      <p className="leading-relaxed mb-4">
        If an item arrives damaged, contact us as soon as possible with your
        order number, photographs of the damaged item, and photographs of the
        packaging. We will review the issue and determine the appropriate
        resolution.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Email and SMS Terms
      </h2>

      <p className="leading-relaxed mb-4">
        By submitting a form on this website, you may choose to receive
        marketing emails and/or text messages from Trevor Twomey Photography.
        Consent is not a condition of purchase.
      </p>

      <p className="leading-relaxed mb-4">
        Message and data rates may apply. Message frequency varies. You may
        unsubscribe from SMS messages at any time by replying STOP. You may
        reply HELP for help. You may unsubscribe from marketing emails by using
        the unsubscribe link included in those emails.
      </p>

      <p className="leading-relaxed mb-4">
        We may use service providers, including Klaviyo, to send email and SMS
        communications and manage subscriber preferences.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Third-Party Services
      </h2>

      <p className="leading-relaxed mb-4">
        This website may use third-party platforms and tools, including Shopify,
        Klaviyo, Google Analytics, Google Tag Manager, payment processors, and
        shipping providers. Your use of those services may also be governed by
        their own terms and privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        No Guarantee of Availability
      </h2>

      <p className="leading-relaxed mb-4">
        We do our best to keep the website available and accurate, but we do not
        guarantee that the website will always be uninterrupted, error-free,
        secure, or current.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Limitation of Liability
      </h2>

      <p className="leading-relaxed mb-4">
        To the fullest extent permitted by law, Trevor Twomey Photography shall
        not be liable for indirect, incidental, special, consequential, or
        punitive damages arising from your use of this website, your purchase of
        products, or your reliance on website content.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Changes to These Terms
      </h2>

      <p className="leading-relaxed mb-4">
        We may update these Terms from time to time. The updated version will be
        posted on this page with a revised effective date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">Contact</h2>

      <p className="leading-relaxed mb-4">
        For questions about these Terms, contact Trevor Twomey Photography at:
      </p>

      <p className="leading-relaxed mb-4">
        <a
          href="mailto:trevor.a.twomey@gmail.com"
          className="underline underline-offset-4 text-black">
          trevor.a.twomey@gmail.com
        </a>
      </p>
    </div>
  );
};

export default TermsOfService;
