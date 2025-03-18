import React from "react";
import withAuth from "@/utils/withAuth";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
const Thievery25 = () => {

  const photos = [
    { src: "/Thievery25/thievery_corporation_terminal5-49.jpg", "type": "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-48.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-41.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-14.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-47.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-42.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-25.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-36.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-18.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-53.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-50.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-8.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-39.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-12.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-2.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-28.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-44.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-9.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-31.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-45.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-4.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-54.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-51.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-35.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-56.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-58.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-20.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-30.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-55.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-11.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-19.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-34.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-38.jpg", type: "portrait" },
    { src: "/Thievery25/thievery_corporation_terminal5-57.jpg", type: "portrait" },
  
  ];
  
  
  return (
    <div>
      <Hero heading="Thievery Photography" message="Explore the best live shots of Thievery Corporation." />
      <Portfolio photos={photos} sectionId="thievery-photos" />
    </div>
  );
};

export default withAuth(Thievery25, ["/music/thievery25"]); // ✅ Only allow Thievery25 users
