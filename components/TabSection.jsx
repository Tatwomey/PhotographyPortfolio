import { useState, useEffect } from "react";

const tabs = [
  { title: "DETAILS", key: "details" },
  { title: "SIZE & FIT", key: "sizeFit" },
  { title: "SHIPPING & RETURNS", key: "shippingReturns" },
];

export default function TabSection() {
  const [activeTab, setActiveTab] = useState("details");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const contentMap = {
    details: (
      <div className="space-y-4">
        <ul className="grid gap-2 list-inside list-disc">
          <li>
            Printed on{" "}
            <span className="font-semibold">
              museum-grade archival Hahnemühle Baryta paper
            </span>
          </li>
          <li>
            Pigment-ink process for deep blacks, smooth tonal transitions, and
            long-term stability
          </li>
          <li>Hand-signed and hand-numbered by the artist</li>
          <li>Embossed mark + Certificate of Authenticity included</li>
          <li>
            Limited edition: only{" "}
            <span className="font-semibold">10 prints</span> released for this
            image
          </li>
        </ul>

        <div className="text-sm text-gray-700 leading-relaxed">
          This is a true limited drop — once the edition is gone, it’s retired.
          Each print is produced, inspected, and finished with collector-level
          handling so it arrives ready for the wall.
        </div>
      </div>
    ),

    sizeFit: (
      <div className="space-y-4">
        <ul className="grid gap-2 list-inside list-disc">
          <li>
            Print size: <span className="font-semibold">16 × 20 in</span>
          </li>
          <li>Designed to frame clean with standard 16 × 20 frames</li>
          <li>Balanced for gallery presentation without overpowering a room</li>
        </ul>

        <div className="text-sm text-gray-700 leading-relaxed">
          This format hits the sweet spot — large enough to feel intentional and
          premium, still versatile for studios, hallways, offices, or living
          spaces. For a classic gallery look, pair with a simple mat and
          UV-protective glazing.
        </div>
      </div>
    ),

    shippingReturns: (
      <div className="space-y-4">
        <ul className="grid gap-2 list-inside list-disc">
          <li>
            Ships within{" "}
            <span className="font-semibold">7–10 business days</span>
          </li>
          <li>Ships securely with tracking included</li>
          <li>
            16 × 20 prints ship rolled in a{" "}
            <span className="font-semibold">
              heavy-duty spiral-wound protective tube
            </span>{" "}
            engineered to resist crushing, bending, and rough handling in
            transit
          </li>
          <li>
            Reinforced end caps keep the print stable from studio to doorstep
          </li>
        </ul>

        <div className="text-sm text-gray-700 leading-relaxed">
          If your print arrives damaged, you’re covered. Send a photo of the
          packaging and print and a replacement will be issued. Because these
          are limited-edition fine art releases, all other sales are final once
          shipped.
        </div>

        <div className="text-sm text-gray-700 leading-relaxed">
          Questions before you buy? Reach out anytime — you’ll get a real
          answer, fast.
        </div>
      </div>
    ),
  };

  return (
    <div className="mt-10 border-t pt-6">
      {!isMobile ? (
        <>
          <div className="flex gap-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-button ${
                  activeTab === tab.key ? "active" : ""
                }`}>
                {tab.title}
                <span />
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-800 leading-relaxed">
            {contentMap[activeTab]}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {tabs.map((tab) => (
            <div key={tab.key} className="border-b pb-4">
              <button
                onClick={() => setActiveTab(tab.key)}
                className="w-full text-left font-semibold text-black">
                {tab.title}
              </button>

              {activeTab === tab.key && (
                <div className="mt-2 text-sm text-gray-800 leading-relaxed">
                  {contentMap[tab.key]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
