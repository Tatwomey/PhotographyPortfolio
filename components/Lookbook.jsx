// components/Lookbook.jsx
import React from "react";

export default function Lookbook({ photos, sectionId }) {
  return (
    <section id={sectionId} className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col space-y-24">
        {photos.map((pair, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start"
          >
            {/* Left Image */}
            <div className="w-full">
              <img
                src={pair[0].src}
                alt={pair[0].alt || `Lookbook Image ${index * 2 + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>

            {/* Right Image (optional) */}
            <div className="w-full">
              {pair[1] && (
                <img
                  src={pair[1].src}
                  alt={pair[1].alt || `Lookbook Image ${index * 2 + 2}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
