import React, { useState } from "react";
import Image from "next/image";

export default function LookbookViewer({ photos }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const selected = photos[selectedIndex];

  const handlePrev = () => {
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex < photos.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black px-4 md:px-16 py-20">
      <div className="flex flex-col md:flex-row items-start justify-center gap-12 max-w-screen-xl mx-auto">
        {/* Main Image */}
        <div className="flex justify-center md:justify-end w-full md:w-2/3">
          <div className="relative w-auto h-auto max-h-[85vh] cursor-zoom-in">
            <Image
              src={selected.src}
              alt={selected.alt || `Look ${selectedIndex + 1}`}
              width={900}
              height={1200}
              className="clickable object-contain h-auto w-auto max-h-[85vh]"
              onClick={() => setIsZoomed(true)}
              priority={true}
            />
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-5 gap-x-3 gap-y-4 max-w-[360px]">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`relative w-[60px] h-[76px] ${
                index === selectedIndex ? "border-red-500 border" : "border-transparent border"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={photo.src}
                alt={photo.alt || `Thumbnail ${index + 1}`}
                width={60}
                height={76}
                className="clickable object-cover hover:opacity-80 transition cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Caption + Pagination */}
      <div className="max-w-screen-xl mx-auto mt-12 text-center text-sm leading-6 tracking-wide">
        {selected.caption && (
          <div className="mb-4">
            <p className="font-semibold">Spring/Summer 2025</p>
            {selected.caption.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {/* Arrows + Pagination */}
        <div className="flex justify-center items-center gap-6 text-gray-600 text-xs mt-4">
          <button
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className={`hover:text-black transition ${
              selectedIndex === 0 ? "opacity-30 cursor-default" : "cursor-pointer"
            }`}
          >
            ←
          </button>
          <span className="tracking-wider">
            {selectedIndex + 1} of {photos.length}
          </span>
          <button
            onClick={handleNext}
            disabled={selectedIndex === photos.length - 1}
            className={`hover:text-black transition ${
              selectedIndex === photos.length - 1 ? "opacity-30 cursor-default" : "cursor-pointer"
            }`}
          >
            →
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-white flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-auto h-auto max-h-[95vh]">
            <Image
              src={selected.src}
              alt={selected.alt}
              width={1200}
              height={1600}
              className="object-contain h-auto w-auto pointer-events-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
