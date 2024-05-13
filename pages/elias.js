import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const photos = [
    { "src": "/Elias_nonpoint_nyc_trevortwomey.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-2.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-38.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-29.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-3.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-4.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-34.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-35.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-6.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-7.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-30.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-8.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-9.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-10.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-31.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-36.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-32.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-33.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-13.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-14.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-15.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-16.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-17.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-18.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-19.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-39.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-20.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-21.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-40.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-24.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-25.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-26.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-37.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-27.jpg", "type": "portrait" },
    { "src": "/Elias_nonpoint_nyc_trevortwomey-28-1.jpg", "type": "portrait" },
];

const Elias = () => {
  const lightboxRef = useRef(null);

  const breakpointCols = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    alert('© Trevor Twomey Photography 2023. All Rights Reserved.');
  };

  useEffect(() => {
    document.addEventListener("contextmenu", function (e) {
      const clickedElement = e.target;
      if (clickedElement.closest(".lg-img-wrap")) {
        e.preventDefault();
        alert("© Trevor Twomey Photography 2023. All Rights Reserved.");
      }
    });
  }, []);

  return (
    <div className="max-w-[1240px] mx-auto py-4 sm:py-16 text-center" id="Elias">
      <h1 className="font-bold text-2xl sm:text-3xl p-4">The Elias Show</h1>
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <div
            className={`relative mb-4 ${photo.type === 'landscape' ? 'my-masonry-grid_column-span-2' : ''}`}
            key={photo.src}
            onContextMenu={handleRightClick}
          >
            <Image
              src={photo.src}
              alt="Photo"
              width={photo.type === 'portrait' ? 500 : 1000}
              height={photo.type === 'landscape' ? 750 : 500}
              layout="responsive"
              className="relative cursor-pointer"
              onClick={() => {
                lightboxRef.current?.openGallery(index);
              }}
           />
          </div>
        ))}
      </Masonry>

      <LightGallery
        onInit={(ref) => {
          if (ref) {
            lightboxRef.current = ref.instance;
          }
        }}
        id="lightGallery"
        download={true}
        zoom={false}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        dynamic
        dynamicEl={photos.map((photo) => ({
          src: photo.src,
          thumb: photo.src,
        }))}
      />
    </div>
  );
};

export default Elias;