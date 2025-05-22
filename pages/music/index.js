import React, { useEffect } from "react";
import Meta from "@/components/Meta";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import { useRouter } from "next/router";
import Lenis from "@studio-freight/lenis";

const allPhotos = [
    { src: "/Jonathan_davis_korn_trevor_twomey-1.jpg", type: "portrait", alt: "Jonathan Davis performing live with Korn at Jones Beach 2022", title: "Jonathan Davis - Korn Live at Jones Beach 2022" },
    { src: "/hidden.png", type: "portrait", alt: "Q-Unique performing with Kings Bounty during Denial video shoot", title: "Q-Unique - Kings Bounty Denial Video Shoot" },
    { src: "/†††(Crosses)_chino_022024_nyc_trevor_twomey.jpg", type: "portrait", alt: "Chino Moreno of ††† (Crosses) performing live in NYC 2024", title: "Chino Moreno - ††† (Crosses) NYC 2024" },
    { src: "/rob_myers_thievery_trevor_twomey-1.jpg", type: "portrait", alt: "Chino Moreno of ††† (Crosses) performing live in NYC 2024", title: "Chino Moreno - ††† (Crosses) NYC 2024" },
     { src: "/fieldy_korn_2020_trevor_twomey-1.jpg", type: "landscape", alt: "Thievery Corporation live at the Capitol Theatre", title: "Thievery Corporation - Capitol Theatre" },
     { src: "/thievery_corporation_nat_leif.jpg", type: "landscape", alt: "Thievery Corporation live at the Capitol Theatre", title: "Thievery Corporation - Capitol Theatre" },
      { src: "/aaron_lewis_staind_trevortwomey_2022-1.jpg", type: "portrait", alt: "Jonathan Davis performing live with Korn at Jones Beach 2022", title: "Jonathan Davis - Korn Live at Jones Beach 2022" },
       { src: "/head_automatica_nyc_2024_trevortwomey-1.jpg", type: "portrait", alt: "Jonathan Davis performing live with Korn at Jones Beach 2022", title: "Jonathan Davis - Korn Live at Jones Beach 2022" },
        { src: "/thoughtcrimes_nyc_trevortwomey-1.jpg", type: "portrait", alt: "Jonathan Davis performing live with Korn at Jones Beach 2022", title: "Jonathan Davis - Korn Live at Jones Beach 2022" },
         { src: "/munk_korn_2024_trevortwomey.jpg", type: "portrait", alt: "Jonathan Davis performing live with Korn at Jones Beach 2022", title: "Jonathan Davis - Korn Live at Jones Beach 2022" },
    { src: "/rob_myers_thievery_trevor_twomey-2.jpg", type: "landscape", alt: "Thievery" },
    { src: "/ray-luzier-korn-2020-trevor-twomey.jpg", type: "landscape", alt: "Ray Luzier of Korn performing live in 2020", title: "Ray Luzier - Korn Live 2020" },
    { src: "/Natalia-clavier-nublu-trevor-twomey.jpg", type: "landscape", alt: "Natalia Clavier performing live at Nublu", title: "Natalia Clavier - Live at Nublu" },
    
{ src: "/Jonathan_davis_korn_2022_trevor_twomey-1.jpg", type: "portrait", alt: "Davey Havok - Bodies Tour 2022", title: "Davey Havok - Bodies Tour 2022" },
    { src: "/raqueljones-thievery-1.jpg", type: "portrait", alt: "Raquel Jones performing with Thievery Corporation | Pier 17 October 12, 2019" },
    { src: "/jonathan-davis-solo-tour-2018-trevor-twomey.jpg.jpg", type: "landscape", alt: "Jonathan Davis performing solo tour in 2018", title: "Jonathan Davis - Solo Tour 2018" },
    { src: "/amy-lee-evanescence-jones-beach-2022-trevor-twomey.jpg", type: "portrait", alt: "Amy Lee of Evanescence performing live at Jones Beach 2022", title: "Amy Lee - Evanescence Jones Beach 2022" },
    { src: "/afi-davey-havok-bodies-tour-2022-nyc-trevor-twomey-1.jpg", type: "portrait", alt: "Davey Havok - Bodies Tour 2022", title: "Davey Havok - Bodies Tour 2022" },
    { src: "/mrs-smith-ibanez-nyc-trevor-twomey-2.jpg", type: "portrait", alt: "Mrs. Smith playing Ibanez guitar live in NYC", title: "Mrs. Smith - Ibanez NYC Performance" },
    { src: "/ellias-nonpoint-nyc-2022-trevor-twomey-1.jpg", type: "portrait", alt: "Elias Soriano of Nonpoint performing live in NYC 2022", title: "Elias Soriano - Nonpoint NYC 2022" },
    { src: "/head-korn-camden-NJ-2021-trevor-twomey.jpg", type: "portrait", alt: "Brian 'Head' Welch of Korn performing in Camden, NJ 2021", title: "Head - Korn Camden NJ 2021" },
    { src: "/Drab_majesty_trevor_twomey-1.jpg", type: "portrait", alt: "Drab Majesty performing live on the Bodies Tour NYC 2022", title: "Drab Majesty - Bodies Tour NYC 2022" },
    { src: "/ray-luzier-korn-2021-glitch-trevor-twomey.jpg", type: "portrait", alt: "Ray Luzier of Korn performing live in 2021", title: "Ray Luzier - Korn 2021" },
    { src: "/†††(Crosses)_022024_nyc_trevor_twomey-5.jpg", type: "portrait", alt: "††† (Crosses) live performance in NYC 2024", title: "††† (Crosses) - NYC 2024" },
    { src: "/frank_thievery_corporation_trevor_twomey-1.jpg", type: "landscape", alt: "Thievery Corporation - Frank on Percussion", title: "Frank / Thievery Corporation" },
    { src: "/munky_korn_trevor_twomey-1.jpg", type: "portrait", alt: "James 'Munky' Shaffer of Korn performing live at FTL20 in 2018", title: "Munky - Korn FTL20 2018" },
    { src: "/Q_unique_nyc_trevor_twomey-1.jpg", type: "portrait", alt: "Q-Unique performing live at Bowery Ballroom", title: "Q-Unique - Bowery Ballroom" },
    { src: "/voxmana-nublu-natalia-clavier-trevor-twomey-.jpg", type: "portrait", alt: "Voxmana performing live at Nublu with Natalia Clavier", title: "Voxmana - Nublu with Natalia Clavier" },
    { src: "/Thievery25/thievery_corporation_terminal5-41.jpg", type: "portrait", alt: "Chris Corner of IAMX performing live at LPR 2023", title: "IAMX - Chris Corner LPR 2023" },
    { src: "/ray_luzier_korn_2022_trevor_twomey-1.jpg", type: "landscape", alt: "Ray Luzier - performing with Korn 2022 at Jones Beach" },
    { src: "/q-unique-mic-kings-bounty-band-trevor-twomey-1.JPG", type: "landscape", alt: "Q-Unique with microphone performing live with Kings Bounty", title: "Q-Unique - Kings Bounty Live" },
    { src: "/ftl20_korn_2018_trevor_twomey-1.jpg", type: "landscape", alt: "Korn fans - Follow The Leader 20th Anniversary Tour", title: "Korn fans - Follow The Leader 20th Anniversary Tour" },
    { src: "/korn-fieldy-allentown-pa-2020-trevor-twomey-1.jpg", type: "landscape", alt: "Fieldy of Korn performing live in Allentown, PA 2020", title: "Fieldy - Korn Allentown PA 2020" },
    { src: "/raquel-jones-capitol-theatre-2018-trevor-twomey.jpg", type: "portrait", alt: "Raquel Jones performing live at Capitol Theatre 2018", title: "Raquel Jones - Capitol Theatre 2018" },
    { src: "/gojira-west-palm-beach-24-trevor-twomey-1.jpg", type: "portrait", alt: "Gojira Performing in West Palm Beach 2024", title: "Gojira Performing in West Palm Beach 2024" },
    { src: "/thievery_corporation_terminal5-28.jpg", type: "portrait", alt: "Puma performing live with Thievery Corporation in 2025", title: "Puma performing live with Thievery Corporation in 2025" },
    { src: "/q-unique-kings-bounty-denial-video-trevor-twomey-1.jpg", type: "portrait", alt: "Q-Unique performing with Kings Bounty during Denial video shoot", title: "Q-Unique - Kings Bounty Denial Video Shoot" },
   { src: "/brazilian_girls_fairfield_ct_trevor_twomey-1.jpg", type: "landscape", alt: "Brazilian Girls - 2016 Fairfield, CT", title: "Brazilian Girls - 2016 Fairfield, CT" }, ];

    const Music = () => {
      const router = useRouter();
    
      useEffect(() => {
        if (typeof window !== "undefined" && router.isReady) {
          // ✅ Redirect only if the hash is missing
          if (!window.location.hash) {
            router.replace("/music#index", undefined, { shallow: true });
          }
    
          // ✅ Ensure smooth scrolling behavior
          setTimeout(() => {
            const section = document.getElementById("music-photography");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            }
          }, 200);
    
          // ✅ Smooth scrolling setup
          const lenis = new Lenis();
          const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);
    
          return () => lenis.destroy();
        }
      }, [router.isReady]);
    
      return (
        <>
          <Meta
            title="Music Photographer - Trevor Twomey"
            description="Explore the dynamic portfolio of music and concert photography by Trevor Twomey."
            keywords="music photography, music photographer, New York based music photographer, NYC music photographer, tour photographer, concert photographer, live music photographer"
          />
          <Hero heading="Music Photography" message="Explore my collection of live music photography." />
          <Portfolio photos={allPhotos} sectionId="music-photography" />
        </>
      );
    };
    
    export default Music;