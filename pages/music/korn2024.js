import React, { useEffect, useRef } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Hero from "@/components/Hero";

const photos = [
  { "src": "/Elias_nonpoint_nyc_trevortwomey.jpg", "type": "portrait" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-2.jpg", "type": "landscape" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-38.jpg", "type": "portrait" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-29.jpg", "type": "portrait" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-3.jpg", "type": "portrait" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-4.jpg", "type": "portrait" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-34.jpg", "type": "square" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-35.jpg", "type": "portrait" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-6.jpg", "type": "landscape" },
  { "src": "/Elias_nonpoint_nyc_trevortwomey-7.jpg", "type": "portrait" }
];

const Korn2024 = () => {
  const lightboxRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault();
    alert('© Trevor Twomey Photography 2025. All Rights Reserved.');
  };

  useEffect(() => {
    document.addEventListener("contextmenu", function (e) {
      if (e.target.closest(".lg-img-wrap")) {
        e.preventDefault();
        alert("© Trevor Twomey Photography 2025. All Rights Reserved.");
      }
    });
  }, []);

  return (
    <div className="max-w-full mx-auto py-4 sm:py-16 px-2 sm:px-4 bg-black">
      <Hero heading="Korn 2024 Photography" message="Explore the electrifying visuals of Korn's 2024 tour." />
      <div className="grid grid-cols-3 gap-4 md:grid-cols-2 sm:grid-cols-1 auto-rows-[250px] md:auto-rows-[350px] lg:auto-rows-[450px]">
        {photos.map((photo, index) => (
          <div key={photo.src} 
               className={`relative group ${photo.type === 'landscape' ? 'col-span-2 row-span-1' : photo.type === 'square' ? 'col-span-1 row-span-1' : 'col-span-1 row-span-2'}`}
          >
            <img
              src={photo.src}
              alt="Photo"
              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-all duration-300"
              onClick={() => lightboxRef.current?.openGallery(index)}
              onContextMenu={handleRightClick}
            />
          </div>
        ))}
      </div>
      <LightGallery
        onInit={(ref) => (lightboxRef.current = ref.instance)}
        download={false}
        zoom={true}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        dynamic
        dynamicEl={photos.map((photo) => ({ src: photo.src, thumb: photo.src }))}
      />
    </div>
  );
};

export default Korn2024;
