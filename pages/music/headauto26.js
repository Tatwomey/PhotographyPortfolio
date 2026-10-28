import Head from "next/head";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import chapters from "../../data/headauto26.json";
import { canViewHeadAuto, galleryPath, isHeadAutoEnabled } from "../../utils/headauto26-access.mjs";

export async function getServerSideProps({ req, res }) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  if (!isHeadAutoEnabled()) return { notFound: true };
  if (!(await canViewHeadAuto(req))) return { redirect: { destination: "/headauto26-login?callbackUrl=" + encodeURIComponent(galleryPath), permanent: false } };
  return { props: { chapters } };
}

export default function HeadAutoLookbook({ chapters }) {
  const photos = chapters.flatMap(chapter => chapter.photos.map(photo => ({ ...photo, chapter: chapter.title })));
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const active = selected === null ? null : photos[selected];
  useEffect(() => {
    if (selected === null) return;
    if (!dialog.current.open) dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  const step = direction => setSelected(index => (index + direction + photos.length) % photos.length);
  const photograph = (photo, eager = false) => (
    <button className="photo-button" onClick={() => setSelected(photos.findIndex(p => p.id === photo.id))} aria-label={"Enlarge " + photo.export}>
      <img src={"/headauto26/" + encodeURIComponent(photo.export)} alt={photo.alt} width={photo.width} height={photo.height} loading={eager ? "eager" : "lazy"} decoding="async" />
    </button>
  );
  return <>
    <Head><title>Head Automatica — Trevor Twomey</title><meta name="robots" content="noindex,nofollow,noarchive" /><meta name="referrer" content="same-origin" /></Head>
    <main className="lookbook">
      <header className="masthead"><a className="wordmark" href="/">Trevor Twomey</a><span>Band &amp; management · <button className="sign-out" onClick={() => signOut({ callbackUrl: "/login?callbackUrl=%2Fmusic%2Fheadauto26" })}>Sign out</button></span></header>
      <section className="cover" aria-labelledby="lookbook-title"><div><p className="eyebrow">Music / 2026 / Selected work</p><h1 id="lookbook-title">HEAD<br />AUTOMATICA<small>SEPTEMBER 25 / 2026</small></h1><p className="show">Bolero Block Party<br />Carlstadt, New Jersey</p></div><figure className="cover-image">{photograph(photos[0], true)}</figure></section>
      <nav className="chapter-nav" aria-label="Lookbook chapters">{chapters.map((chapter, index) => <a key={chapter.id} href={"#" + chapter.id}><span>0{index + 1}</span>{chapter.title}</a>)}</nav>
      {chapters.map((chapter, index) => <section key={chapter.id} className={"chapter chapter-" + chapter.id} id={chapter.id} aria-labelledby={chapter.id + "-title"}>
        <div className="chapter-heading"><span className="chapter-number">0{index + 1}</span><div><h2 id={chapter.id + "-title"}>{chapter.title}</h2><p>{chapter.subtitle}</p></div><span className="count">{chapter.photos.length} photographs</span></div>
        <div className="spreads">{chapter.photos.map((photo, photoIndex) => <figure key={photo.id} className={photo.landscape ? "landscape" : photoIndex === 0 && (chapter.photos.length % 2 === 1 || chapter.photos[chapter.photos.length - 1].landscape) ? "opening" : ""}>{photograph(photo)}</figure>)}</div>
      </section>)}
      <footer><span>Photography &amp; treatments © Trevor Twomey</span><a href="#lookbook-title">Back to top ↑</a></footer>
    </main>
    <dialog ref={dialog} className="viewer" aria-label="Photograph viewer" onClose={() => setSelected(null)} onKeyDown={event => { if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); } if (event.key === "ArrowRight") { event.preventDefault(); step(1); } }}>
      <div className="viewer-inner"><div className="viewer-bar"><span>{active ? active.chapter + " / " + (selected + 1) + " of " + photos.length : ""}</span><div className="viewer-controls"><button onClick={() => step(-1)} aria-label="Previous photograph">←</button><button onClick={() => step(1)} aria-label="Next photograph">→</button><button onClick={() => dialog.current.close()}>Close ×</button></div></div>
      {active && <img className="viewer-image" src={"/headauto26/" + encodeURIComponent(active.export)} alt={active.alt} width={active.width} height={active.height} />}<div className="viewer-caption">{active?.export}</div></div>
    </dialog>
    <style jsx global>{`
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#0b0c0d;color:#eeece5}.lookbook{min-height:100vh;padding:0 clamp(20px,5vw,88px);font-family:Arial,Helvetica,sans-serif}a{color:inherit;text-decoration:none}button{font:inherit;color:inherit;cursor:pointer}a:focus-visible,button:focus-visible{outline:2px solid #91d0df;outline-offset:6px}.review-bar{background:#e8e4da;color:#181818;text-align:center;padding:10px;font:10px Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}.masthead{display:flex;justify-content:space-between;gap:24px;padding:27px 0;border-bottom:1px solid #383a3b;font-size:10px;text-transform:uppercase;letter-spacing:.16em}.wordmark{font-weight:bold}.sign-out{background:none;border:0;padding:0;font:inherit;color:inherit;text-transform:inherit;letter-spacing:inherit;text-decoration:underline;text-underline-offset:4px}.masthead>span{color:#a5a6a4}.cover{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:4vw;align-items:center;padding:54px 0 48px;max-width:1440px;margin:auto}.eyebrow{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#a5a6a4}h1{font-family:Impact,'Arial Narrow',Arial,sans-serif;font-size:clamp(50px,7.4vw,115px);line-height:.92;font-weight:900;letter-spacing:-.045em;margin:34px 0 28px}h1 small{display:block;font-family:Arial,sans-serif;font-size:12px;font-weight:400;letter-spacing:.35em;line-height:1;margin-top:25px;color:#80b8c5}.show{font-size:12px;line-height:1.8;color:#aaa9a4}.cover-image{min-width:0;max-width:430px;width:100%;justify-self:end;margin:0}.photo-button{display:block;background:none;border:0;padding:0;width:100%;text-align:inherit}.photo-button img{transition:opacity .2s}.photo-button:hover img{opacity:.9}img{display:block;width:100%;height:auto}.cover-image img{max-height:65vh;width:auto;max-width:100%;margin-left:auto}.chapter-nav{display:flex;gap:35px;flex-wrap:wrap;padding:22px 0 26px;max-width:1440px;margin:0 auto;font-size:12px}.chapter-nav a{display:flex;gap:14px}.chapter-nav span{font-size:9px;color:#8b8d8c}.chapter{padding:60px 0 100px;border-top:1px solid #383a3b;scroll-margin-top:20px;max-width:1440px;margin:auto}.chapter-heading{display:flex;gap:25px;align-items:baseline;margin-bottom:42px}.chapter-number{font-size:11px;color:#c6c1b5}h2{font-size:clamp(38px,5vw,70px);font-weight:400;letter-spacing:-.05em;margin:0}.chapter-heading p{font-size:12px;color:#9a9d9c;margin-top:10px}.count{margin-left:auto;font-size:9px;text-transform:uppercase;letter-spacing:.13em;color:#9a9d9c}.spreads{display:grid;grid-template-columns:1fr 1fr;gap:56px 32px;align-items:center}.spreads figure{margin:0}.spreads figure.opening{grid-column:1/-1;width:55%;margin:0 auto 12px}.spreads figure.landscape{grid-column:1/-1;width:100%;padding:0}.spreads figure:last-child:nth-child(even){justify-self:center}.spreads img{object-fit:contain}figcaption{margin-top:12px;color:#818684;font-size:9px;letter-spacing:.07em;text-transform:uppercase}.chapter-cold-light .chapter-number{color:#80b8c5}.chapter-ink .chapter-number{color:#c6b78e}.chapter-signal .chapter-number{color:#e58595}footer{display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;padding:30px 0 50px;border-top:1px solid #383a3b;font-size:10px;color:#9a9d9c}.viewer{background:#080909;color:#eeece5;border:0;padding:20px;width:100vw;height:100dvh;max-width:none;max-height:none;overflow:hidden}.viewer::backdrop{background:#080909}.viewer-inner{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:16px}.viewer-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;font:11px Arial,sans-serif}.viewer-bar button{background:none;border:1px solid #494c4c;padding:10px 16px}.viewer-image{width:100%;height:100%;object-fit:contain}.viewer-caption{color:#a5a6a4;font:10px Arial,sans-serif;text-align:center}.viewer-controls{display:flex;gap:10px}@media(max-width:700px){.masthead{font-size:9px}.masthead>span{max-width:120px;text-align:right}.cover{grid-template-columns:minmax(0,1fr);gap:32px;padding:35px 0}h1{font-size:clamp(36px,11.5vw,76px);margin:24px 0}.cover-image{justify-self:center;max-width:100%}.cover-image img{max-height:68vh;margin:auto}.chapter-nav{gap:22px}.chapter{padding:38px 0 65px}.chapter-heading{gap:16px;margin-bottom:30px}.count{display:none}.spreads{gap:32px 15px}.spreads figure.opening{width:85%}figcaption{font-size:8px}.viewer{padding:12px}.viewer-bar{font-size:10px}.viewer-bar button{padding:10px 12px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.photo-button img{transition:none}}
`}</style>
  </>;
}
