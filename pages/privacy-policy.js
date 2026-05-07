import React, { useEffect } from "react";

const PrivacyPolicy = () => {
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
        Privacy Policy
      </h1>

      <p className="mb-6 text-gray-500">Effective Date: May 7, 2026</p>

      <p className="leading-relaxed mb-4">
        Trevor Twomey Photography respects your privacy. This Privacy Policy
        explains how we collect, use, and protect information when you visit
        this website, join our email or SMS list, contact us, or purchase
        photography prints or related products.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Information We Collect
      </h2>

      <p className="leading-relaxed mb-4">
        We may collect personal information you choose to provide, including
        your name, email address, phone number, shipping address, billing
        information, order details, and any message you submit through a form on
        this website.
      </p>

      <p className="leading-relaxed mb-4">
        We may also collect basic website usage information such as pages
        visited, device type, browser type, referral source, approximate
        location, and interactions with the website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        How We Use Your Information
      </h2>

      <p className="leading-relaxed mb-4">
        We use your information to process orders, deliver products, respond to
        inquiries, provide customer support, send order updates, improve the
        website, understand audience behavior, and share photography releases,
        print drops, promotions, and other marketing communications you have
        opted in to receive.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Email and SMS Marketing
      </h2>

      <p className="leading-relaxed mb-4">
        If you sign up for email or SMS updates, we may send you messages about
        limited-edition print releases, early access opportunities, product
        updates, promotions, and related photography news.
      </p>

      <p className="leading-relaxed mb-4">
        SMS consent is not a condition of purchase. Message and data rates may
        apply. Message frequency varies. You may unsubscribe from text messages
        at any time by replying STOP. You may reply HELP for help.
      </p>

      <p className="leading-relaxed mb-4">
        We do not sell your SMS consent or phone number. We may share necessary
        information with service providers who help us operate email and SMS
        programs, including Klaviyo.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Ecommerce and Payments
      </h2>

      <p className="leading-relaxed mb-4">
        Purchases may be processed through third-party ecommerce and payment
        providers, including Shopify and related payment processors. These
        providers may collect and process information needed to complete your
        transaction, fulfill your order, prevent fraud, and provide customer
        support.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Analytics and Tracking
      </h2>

      <p className="leading-relaxed mb-4">
        We may use analytics and advertising tools, including Google Analytics,
        Google Tag Manager, Shopify, and Klaviyo, to understand website traffic,
        improve the shopping experience, measure conversions, and communicate
        with subscribers.
      </p>

      <p className="leading-relaxed mb-4">
        These tools may use cookies, pixels, or similar technologies to collect
        information about how visitors interact with the website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Sharing of Information
      </h2>

      <p className="leading-relaxed mb-4">
        We may share information with trusted service providers who help us
        operate this website, process payments, fulfill orders, send marketing
        communications, analyze performance, and provide customer support.
      </p>

      <p className="leading-relaxed mb-4">
        We do not sell your personal information in the ordinary sense of
        exchanging it for money.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Your Choices
      </h2>

      <p className="leading-relaxed mb-4">
        You may unsubscribe from marketing emails by clicking the unsubscribe
        link in any email. You may opt out of SMS messages by replying STOP. You
        may also contact us to request access, correction, or deletion of your
        personal information, subject to legal and operational limits.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Data Retention
      </h2>

      <p className="leading-relaxed mb-4">
        We retain personal information only as long as necessary to provide
        services, fulfill orders, maintain business records, comply with legal
        obligations, resolve disputes, and enforce agreements.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">Security</h2>

      <p className="leading-relaxed mb-4">
        We use reasonable safeguards to protect personal information. However,
        no website, platform, or transmission method is completely secure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Children&apos;s Privacy
      </h2>

      <p className="leading-relaxed mb-4">
        This website is not intended for children under 13. We do not knowingly
        collect personal information from children under 13.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">
        Updates to This Policy
      </h2>

      <p className="leading-relaxed mb-4">
        We may update this Privacy Policy from time to time. The updated version
        will be posted on this page with a revised effective date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-black">Contact</h2>

      <p className="leading-relaxed mb-4">
        For privacy questions or requests, contact Trevor Twomey Photography at:
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

export default PrivacyPolicy;
