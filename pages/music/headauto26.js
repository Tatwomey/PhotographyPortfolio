import HeadAutoMural from "../../components/HeadAutoMural";
import chapters from "../../data/headauto26.json";
import { canViewHeadAuto, galleryPath, isHeadAutoEnabled } from "../../utils/headauto26-access.mjs";

export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  if (!isHeadAutoEnabled()) return { notFound: true };
  if (!(await canViewHeadAuto(req))) return { redirect: { destination: "/headauto26-login?callbackUrl=" + encodeURIComponent(galleryPath), permanent: false } };
  return { props: { chapters } };
}

export default HeadAutoMural;
