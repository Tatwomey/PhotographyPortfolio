import { useState, useEffect } from "react";

// ✅ Only show "DETAILS"
const tabs = ["DETAILS"];

export default function TabSection({ details }) {
  const [activeTab, setActiveTab] = useState("DETAILS");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const contentMap = {
    "DETAILS": (
      <ul className="grid gap-2 list-inside list-disc">
        <li>Printed on museum-grade archival Hahnemühle Baryta paper</li>
        <li>Hand-signed, hand-numbered, and embossed</li>
        <li>From the original RAW file — ultra high-resolution fidelity</li>
        <li>Limited to just 10 copies produced</li>
        <li>Print size: 16 × 20 inches</li>
      </ul>
    ),
    // ❌ Temporarily removed:
    // "SIZE & FIT": <p>[Size & Fit content coming soon]</p>,
    // "SHIPPING & RETURNS": <p>[Shipping & Returns content coming soon]</p>
  };

  return (
    <div className="mt-10 border-t pt-6">
      {!isMobile ? (
        <div className="flex gap-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-3 text-sm font-semibold text-gray-600 hover:text-black transition group"
            >
              {tab}
              <span
                className={`absolute bottom-0 left-1/2 h-[2px] bg-black transition-all duration-300 ease-out ${
                  activeTab === tab
                    ? "w-full left-0"
                    : "w-0 group-hover:w-full group-hover:left-0"
                }`}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {tabs.map((tab) => (
            <div key={tab} className="border-b pb-4">
              <button
                onClick={() => setActiveTab(tab)}
                className="w-full text-left font-semibold text-black"
              >
                {tab}
              </button>
              {activeTab === tab && (
                <div className="mt-2 text-sm text-gray-800">
                  {contentMap[tab]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isMobile && (
        <div className="mt-6 text-sm text-gray-800 leading-relaxed">
          {contentMap[activeTab]}
        </div>
      )}
    </div>
  );
}
