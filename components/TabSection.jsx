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
      <ul className="grid gap-2 list-inside list-disc">
        <li>Printed on museum-grade archival Hahnemühle Baryta paper</li>
        <li>Hand-signed, hand-numbered, and embossed</li>
        <li>From the original RAW file — ultra high-resolution fidelity</li>
        <li>Limited to just 10 copies produced</li>
        <li>Print size: 16 × 20 inches</li>
      </ul>
    ),
    sizeFit: (
      <p>
        This edition is printed true to size at 16 × 20 inches — ideal for framing and
        gallery presentation. For optimal display, use archival framing materials and UV-protective glass.
      </p>
    ),
    shippingReturns: (
      <p>
        Smaller prints ship flat in archival-safe packaging. 16 × 20 inch prints are
        carefully rolled and shipped in reinforced protective tubes. U.S. orders are
        shipped via USPS or UPS based on location and method selected at checkout.
        International shipments may be subject to customs duties. All sales final unless
        prints are damaged in transit.
      </p>
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
                className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
              >
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
                className="w-full text-left font-semibold text-black"
              >
                {tab.title}
              </button>
              {activeTab === tab.key && (
                <div className="mt-2 text-sm text-gray-800">
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
