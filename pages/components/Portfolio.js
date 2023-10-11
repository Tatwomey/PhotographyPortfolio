import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import LightGallery from "lightgallery/react";
import LightGalleryComponent from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const photos = [
  {src: '/JD-korn-jones-beach-2022-trevor-twomey-5.jpg'},
  {src: '/q-unique-kings-bounty-denial-video-trevor-twomey-1.jpg'},
  
  { src: '/amy-lee-evanescence-jones-beach-2022-trevor-twomey.jpg' },
  { src: '/munky-korn-camden-nj-2022-trevor-twomey.jpg' },
  {src: '/mrs-smith-ibanez-nyc-trevor-twomey-2.jpg'},
  {src:'/head-korn-camden-NJ-2021-trevor-twomey.jpg'},
  {src: '/drab-majesty-bodies-tour-2022-nyc-trevor-twomey.jpg'},
  { src: '/head-korn-jones-beach-2022-trevor-twomey-2.jpg' },
  { src: '/q-unique-bowery-ballroom-trevortwomey-1.jpg' },
   {src: '/aaron-lewis-staind-camden-NJ-2021-trevor-twomeytwomey.jpg'},
  {src:'/natalia-clavier-thievery-corporation-2016-hot-august-music-festival-trevor-twomey-1.jpg' },
  {src: '/iamx-chris-corner-lpr-2023-trevor-twomey-3.jpg'},
  {src: '/JD-korn-jones-beach-2022-trevor-twomey-3.jpg'},
  {src: '/craig-bonich-brooklyn-bowl-trevor-twomey.JPG'},
  {src: '/munky-korn-glitch-ftl20-2018-trevor-twomey.jpg'},
  {src: '/munky-korn-camden-NJ-2021-trevor-twomey.jpg'},
  {src: '/q-unique-kings-bounty-denial-video-trevor-twomey.jpg'},
  {src: '/head-korn-jones-beach-ny-2022-trevor-twomey-.jpg'},
  {src: '/lajon-sevendust-nyc-2022-trevor-twomey.jpg'},
  {src: '/munky-korn-homdel-nj-2021-trevor-twomey-4.jpg' },
  {src: '/stella-nyc-may-2023-trevor-twomey.jpg'},
  {src: '/head-korn-autograph-camden-nj-2022-trevor-twomey.jpg'},
  {src: '/clint-lowery-sevendust-nyc-2022-trevor-twomey.jpg'},
  {src: '/JD-korn-jones-beach-2022-trevor-twomey-jpg.jpg'},
  {src: '/q-unique-bowery-ballroom-nyc-trevor-twomey.jpg'},
  {src: '/head-korn-homdel-nj-2021-trevor-twomey.jpg'},
  {src: '/Hash-thievery-corporation-trevor-twomey.jpg'},
  {src: '/JD-korn-camden-nj-2022-trevor-twomey.jpg'},
  {src: '/iamx-chris-corner-LPR-2023-trevortwomey-4.jpg'},
  {src: '/mike-dijan-kings-bounty-band-trevor-twomey.JPG'},
  {src: '/fieldy-head-korn-buckcherry-2013-trevor-twomey.jpg' },
  {src: '/mike-dijan-kings-bounty-rehersal-trevor-twomey.jpg' },
  {src: '/fieldy-korn-allentown-PA-2020-trevor-twomey.jpg'},
  {src: '/tim-mccord-evanescence-jones-beach-2022-trevor-twomey.jpg'},
  {src: '/head-korn-jones-beach-2022-trevor-twomey.jpg'},
  {src: '/amy-lee-evanescence-jones-beach-2022-trevor-twomey-2.jpg'},
  { src: '/JD-korn-jones-beach-2022-trevor-twomey.jpg' },
  {src: '/mrs-smith-ibanez-nyc-trevor-twomey.jpg' },
  
  {src: '/sevendust-fans-nyc-2022-trevor-twomey.jpg'},
  { src: '/JD-korn-jones-beach-2022-trevor-twomey-2.jpg' },
  { src: '/IAMX-chris-corner-lpr-2023-trevor-twomey-2.jpg' },
  { src: '/hash-thievery-corporation-2013-trevor-twomey-1.jpg' },
  { src: '/iamx-lpr-2023-trevor-twomey.jpg'},
  { src: '/ra-diaz-korn-jones-beach-2022-trevortwomey.jpg' },
  {src: '/ray-luzier-korn-jones-beach-2022-trevor-twomey.jpg' },
  {src: '/lou-lou-thievery-corporation-capitol-theatre-trevor-twomey-1.jpg'},
  { src: '/munky-korn-camden-nj-2022-trevor-twomey-1.jpg' },
  { src: '/iamx-chris-corner-lpr-2023-trevor-twomey.jpg'},
  {src: '/JR-korn-jones-beach-2022-trevortwomey.jpg'},
  {src: '/head-korn-los-angeles-2015-trevor-twomey-1.JPG'},
 
];

const Portfolio = () => {
  const lightboxRef = useRef(null);

  const breakpointCols = {
    default: 4,  // default to four images per row
    1100: 3,    // three images per row for larger screens
    700: 2,     // two images per row for medium screens
    500: 1      // one image per row for small screens
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
    <div className="max-w-[1240px] mx-auto py-4 sm:py-16 text-center" id="music-photography">
      <h1 className="font-bold text-2xl sm:text-3xl p-4">Music Photography</h1>
      <Masonry
        breakpointCols={breakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((photo, index) => (
          <div
            className="relative mb-4"
            key={photo.src}
            onContextMenu={handleRightClick}
          >
            <Image
              src={photo.src}
              alt="Photo"
              width={500}
              height={750}
              layout="responsive"
              className="relative cursor-pointer"
            />
            <div
              className="absolute w-full h-full inset-0 bg-transparent hover:bg-stone-900 hover:bg-opacity-10 cursor-pointer"
              onClick={() => {
                lightboxRef.current?.openGallery(index);
              }}
            ></div>
          </div>
        ))}
      </Masonry>


      <LightGalleryComponent
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

export default Portfolio;