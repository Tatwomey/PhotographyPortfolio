import Head from "next/head";
import { signOut } from "next-auth/react";

const photoUrl = photo =>
  (photo.protected ? "/api/headauto26/" : "/headauto26/") + encodeURIComponent(photo.export);

// Layout-only treatments. The curated source order and original exports stay intact.
const compositions = [
  { title: "ECHO", layout: "echo", hero: 0, frame: 2, stock: 2, contact: 1, brush: 0 },
  { title: "01 / 24", layout: "reverse", hero: 2, frame: 0, stock: 6, contact: 4 },
  { title: "FRAGMENT", layout: "fragment", hero: 0, frame: 3, stock: 3, contact: 5 },
  { title: "SIGNAL", layout: "reverse", hero: 1, frame: 3, stock: 7, contact: 10 },
  { title: "NOISE", layout: "fragment", hero: 2, frame: 0, stock: 9, contact: 3, brush: 2 },
  { title: "END / TRANSMISSION", layout: "final", hero: 3, frame: 1, stock: 8, contact: 8 },
];

// Aperture coordinates in the original scans, expressed as normalized insets
// within the chosen viewBox. The image fills the opening at its native ratio.
const filmStocks = {
  scan: { file:"negative-frame.jpeg", width:1536, height:1024, box:"0 0 910 1080", transform:"translate(945 -280) rotate(90)", insets:[.021,.07,.021,.07] },
  2: { width:1417, height:2048, box:"100 70 1170 1900", insets:[.134,.071,.127,.071] },
  3: { width:2048, height:1239, box:"690 28 685 1182", insets:[.148,.055,.132,.055] },
  6: { width:2048, height:1533, box:"0 0 1160 1533", insets:[.051,.066,.041,.043] },
  7: { width:1537, height:2048, box:"0 0 760 1050", insets:[.052,.119,.043,.176] },
  8: { width:2048, height:1279, box:"0 0 708 783", transform:"translate(708 -665) rotate(90)", insets:[.024,.141,.023,.167] },
  9: { width:2022, height:2048, box:"155 0 1738 2022", transform:"translate(2048 0) rotate(90)", insets:[0,.132,0,.12] },
};
const designUrl = file => /\.jpe?g$/i.test(file) ? "/api/headauto26/texture-" + file : "/headauto26-design/" + file;
const stockFile = stock => designUrl(filmStocks[stock].file ?? `frame${stock}.webp`);
const framePadding = (stock, photo) => {
  // Slight overscan avoids a visible empty seam at the imperfect cutout edge.
  const [top,right,bottom,left] = filmStocks[stock].insets.map(n => Math.max(0,n-.006));
  const heightPerWidth = (1-left-right) / (photo.width/photo.height) / (1-top-bottom);
  return [top*heightPerWidth,right,bottom*heightPerWidth,left].map(n => `${100*n}%`).join(" ");
};

const stopSave = event => event.preventDefault();

function Photograph({ photo, priority = false, className = "", film = false, brush = false }) {
  const stock = film ? filmStocks[film] : null;
  return (
    <figure
      className={`ha-photo ${className} ${film ? "ha-film" : ""}`}
      style={{ "--photo-ratio": `${photo.width} / ${photo.height}`,
        ...(className === "ha-hero" ? {"--photo-echo": `url("${photoUrl(photo)}")`} : {}),
        ...(stock ? {"--frame-padding":framePadding(film,photo)} : {}) }}
      onContextMenu={stopSave}
      onDragStart={stopSave}
    >
      {stock && <svg className="ha-negative-frame" viewBox={stock.box} preserveAspectRatio="none" aria-hidden="true">
        <image href={stockFile(film)} width={stock.width} height={stock.height} transform={stock.transform} />
      </svg>}
      <div className="ha-image">
        <img src={photoUrl(photo)} alt={photo.alt} width={photo.width} height={photo.height}
          loading={priority ? "eager" : "lazy"} decoding="async" draggable={false} />
        {brush && <span className="ha-ink-brush" aria-hidden="true" />}
        <span className="ha-image-shield" aria-hidden="true" />
      </div>
    </figure>
  );
}

function Composition({ photos, number }) {
  const design = compositions[number % compositions.length];
  // Every original gets a large, uncropped placement; overlaps touch edges only.
  const secondary = photos.map((_, i) => i).filter(i => i !== design.hero);
  const slot = i => i === design.hero ? "hero" : `support-${secondary.indexOf(i) + 1}`;
  return (
    <section className={`ha-composition ha-layout-${design.layout}`} aria-label={`Photographs ${number * 4 + 1}–${number * 4 + photos.length}`}>
      <div className="ha-collage-ground" aria-hidden="true">
        {photos.map(photo => <span key={photo.id} className="ha-fragment" style={{"--fragment":`url("${photoUrl(photo)}")`}} />)}
      </div>
      <div className="ha-kodak-strip" aria-hidden="true" />
      <div className="ha-contact-overlay" style={{"--contact":`url("${designUrl(`frame${design.contact}.webp`)}")`}} aria-hidden="true" />
      <div className="ha-composition-note" aria-hidden="true">
        <span>HA / 26</span><span>F{String(number + 1).padStart(2, "0")}</span>
      </div>
      <div className="ha-stamp" aria-hidden="true">{design.title}</div>
      {photos.map((photo, i) => (
        <Photograph key={photo.id} photo={photo} className={`ha-${slot(i)}`}
          brush={i === design.brush}
          film={i === design.frame && i !== design.hero ? design.stock : false} />
      ))}
      <div className="ha-composition-footer" aria-hidden="true">TT / 2026 &nbsp; · &nbsp; SELECTED SHOTS &nbsp; // &nbsp; {String(number + 1).padStart(2, "0")}</div>
    </section>
  );
}

export default function HeadAutoMural({ chapters }) {
  const all = chapters.flatMap(chapter => chapter.photos);
  const cover = all.find(photo => photo.coverOnly) ?? all[0];
  const photos = all.filter(photo => !photo.coverOnly);
  const panels = Array.from({ length: Math.ceil(photos.length / 4) }, (_, i) => photos.slice(i * 4, i * 4 + 4));
  return (
    <>
      <Head>
        <title>Head Automatica — Trevor Twomey</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="same-origin" />
      </Head>
      <main className="ha-mural" onDragStart={stopSave} onContextMenu={stopSave}>
        <header className="ha-masthead">
          <a href="/" className="ha-credit">TREVOR TWOMEY / PHOTOGRAPHY</a>
          <span>PRIVATE VIEWING · <button onClick={() => signOut({ callbackUrl: "/headauto26-login" })}>Sign out</button></span>
        </header>
        <section className="ha-cover" aria-labelledby="ha-title">
          <div className="ha-cover-type">
            <p className="ha-kicker">LIVE ARCHIVE / 026</p>
            <h1 id="ha-title">HEAD<br />AUTOMATICA<span className="ha-year">26</span></h1>
            <p className="ha-cover-date">25 SEP 2026 / BOLERO BLOCK PARTY<br />CARLSTADT, NEW JERSEY</p>
            <a href="#signal" className="ha-scroll">ENTER SELECTED SHOTS <span aria-hidden="true">↓</span></a>
          </div>
          <Photograph photo={cover} priority className="ha-cover-photo" film="scan" />
          <div className="ha-cover-edge" aria-hidden="true">FRAME 00A / DO NOT DUPLICATE</div>
        </section>
        <section id="signal" aria-labelledby="ha-signal-title" className="ha-sequence">
          <div className="ha-sequence-heading">
            <span className="ha-kicker">01 / {String(photos.length).padStart(2, "0")} EXPOSURES</span>
            <div className="ha-heading-lockup">
              <h2 id="ha-signal-title">SELECTED <span>SHOTS</span></h2>
              <span className="ha-heading-grid" aria-hidden="true" />
            </div>
            <p>Color splits. Frames repeat.<br />The set becomes collage.</p>
          </div>
          {panels.map((panel, i) => <Composition key={panel[0].id} photos={panel} number={i} />)}
        </section>
        <footer className="ha-footer">
          <span>PHOTOGRAPHY &amp; TREATMENTS © TREVOR TWOMEY<br />PRIVATE VIEWING / ALL RIGHTS RESERVED</span>
          <a href="#ha-title">BACK TO TOP ↑</a>
        </footer>
      </main>
      <style jsx global>{`
        .ha-mural {
          --ground: #101010; --ink: #e9e6df; --accent: #e0b845;
          position:relative; width: 100%; min-height: 100vh; overflow: clip;
          background: var(--ground); color: var(--ink);
          font-family: Arial, Helvetica, sans-serif;
        }
        .ha-mural *, .ha-mural *::before, .ha-mural *::after { box-sizing: border-box; }
        .ha-mural a { color: inherit; text-decoration: none; }
        .ha-mural a:focus-visible, .ha-mural button:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }
        .ha-masthead, .ha-footer { display:flex; align-items:center; justify-content:space-between; gap:20px; padding:22px 4.5vw; font: 10px/1.6 'Courier New', monospace; letter-spacing:.12em; }
        .ha-masthead { position:absolute; top:0; left:0; right:0; z-index:10; background:linear-gradient(180deg,#050505d9,transparent); }
        .ha-masthead button { background:none; border:0; color:inherit; padding:0; font:inherit; text-transform:uppercase; text-decoration:underline; text-underline-offset:3px; }
        .ha-credit { font-weight:700; white-space:nowrap; }
        .ha-cover { min-height: min(900px, 90vw); margin:0; position: relative; isolation:isolate; display:grid; grid-template-columns: repeat(12, minmax(0,1fr)); align-items:center; padding: 8vw 4.5vw 4vw; overflow:hidden; }
        .ha-cover::before { content:""; position:absolute; inset:0; background:linear-gradient(90deg,#09090980 0%,#09090920 57%,#09090910 100%),url("/api/headauto26/texture-kodak-5063-strip.jpeg") center / cover no-repeat; z-index:-1; }
        .ha-cover-type { grid-area: 1/1/2/7; position:relative; z-index:3; align-self:center; padding-top: 1.5vw; }
        .ha-kicker, .ha-cover-date, .ha-scroll, .ha-cover-edge { font: 11px/1.65 'Courier New', monospace; letter-spacing:.16em; }
        .ha-kicker { color:var(--accent); margin:0 0 1.4vw; }
        .ha-cover h1 { font-family:Impact,'Arial Narrow','Helvetica Neue',Arial,sans-serif; font-weight:900; font-size:clamp(32px,6.1vw,110px); line-height:.9; letter-spacing:-.065em; margin:0; color:var(--ink); text-shadow:0 3px 18px #0009; }
        .ha-year { display:block; color:var(--accent); font-size:.78em; line-height:.9; }
        .ha-cover-date { width:max-content; max-width:100%; margin:18px 0; background:#101010d9; padding:8px 14px 8px 0; }
        .ha-scroll { display:inline-flex; gap:20px; align-items:center; border-bottom:1px solid var(--accent); padding:12px 0; background:#101010d9; }
        .ha-cover-photo { grid-area:1/7/2/13; align-self:center; z-index:2; height:auto; }
        .ha-cover-edge { position:absolute; bottom:3vw; right:4.5vw; color:#a49d89; letter-spacing:.1em; }
        .ha-sequence { position:relative; margin:0; }
        .ha-sequence-heading { position:absolute; top:0; left:0; right:0; z-index:8; pointer-events:none; display:flex; align-items:center; gap:12px 20px; padding:14px 3vw; background:linear-gradient(180deg,#0b0b0bb0,transparent); text-shadow:0 2px 15px #000; }
        .ha-sequence-heading .ha-kicker { margin:0; }
        .ha-heading-lockup { display:flex; flex-direction:column; align-items:flex-start; gap:6px; }
        .ha-sequence-heading h2 { font-size:clamp(24px,4vw,64px); font-weight:900; line-height:.95; letter-spacing:-.075em; margin:0; }
        .ha-sequence-heading h2 span { color:var(--accent); }
        .ha-heading-grid { display:block; width:clamp(110px,13vw,170px); aspect-ratio:798 / 150; background:url("/headauto26-design/selected-shots-grid.png") left center / contain no-repeat; }
        .ha-sequence-heading p { margin:0; font:12px/1.55 'Courier New',monospace; color:#d3d0c9; }
        .ha-composition { display:grid; grid-template-columns:repeat(16, minmax(0,1fr)); grid-template-rows:auto auto; position:relative; isolation:isolate; margin:0; padding:36px 2vw 32px; overflow:hidden; }
        .ha-sequence-heading + .ha-composition { padding-top:clamp(120px,12vw,166px); }
        .ha-collage-ground { position:absolute; inset:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); grid-template-rows:repeat(2,minmax(0,1fr)); background:#141414 url("/api/headauto26/texture-kodak-5063-strip.jpeg") center top / 100% auto repeat-y; z-index:0; pointer-events:none; }
        .ha-fragment { display:block; position:relative; overflow:hidden; min-width:0; min-height:0; }
        .ha-fragment::before { content:""; position:absolute; inset:-19%; background:var(--fragment) 35% 42% / cover no-repeat; filter:brightness(.60) saturate(.82); }
        .ha-fragment:nth-child(even)::before { background-position:70% 60%; filter:brightness(.53) saturate(.86); }
        .ha-layout-fragment .ha-fragment:nth-child(3)::before { filter:brightness(.6) grayscale(.45); }
        .ha-kodak-strip { position:absolute; inset:0 auto 0 28%; width:54%; z-index:1; pointer-events:none; background:url("/api/headauto26/texture-kodak-5063-strip.jpeg") center top / 190% auto repeat-y; opacity:.54; }
        .ha-contact-overlay { position:absolute; inset:12% 0 auto; height:42%; z-index:1; background:var(--contact) center / 100% auto no-repeat; opacity:.85; pointer-events:none; }
        .ha-layout-reverse .ha-contact-overlay { inset:54% 0 auto; height:38%; }
        .ha-layout-fragment .ha-contact-overlay { inset:26% 0 auto; transform:rotate(-1.5deg); }
        .ha-layout-reverse .ha-kodak-strip { left:auto; right:34%; }
        .ha-layout-fragment .ha-kodak-strip { left:2%; width:58%; }
        .ha-composition:last-child { padding-bottom:100px; }
        .ha-photo { margin:0; position:relative; min-width:0; min-height:0; align-self:center; user-select:none; -webkit-user-select:none; -webkit-touch-callout:none; }
        .ha-image { width:100%; height:auto; aspect-ratio:var(--photo-ratio); position:relative; overflow:hidden; background:transparent; }
        .ha-image img { width:100%; height:auto; aspect-ratio:var(--photo-ratio); display:block; object-fit:contain; object-position:center; -webkit-user-drag:none; user-select:none; }
        .ha-image-shield { position:absolute; inset:0; z-index:1; -webkit-touch-callout:none; }
        .ha-image:has(.ha-ink-brush) { isolation:isolate; }
        .ha-ink-brush { position:absolute; inset:0; background:url("/api/headauto26/texture-ink-brush-frame.jpg") center / 106% 106% no-repeat; filter:contrast(1.6); mix-blend-mode:multiply; pointer-events:none; }
        .ha-hero { grid-area:1/1/2/10; z-index:4; padding:0; }
        .ha-hero .ha-image { box-shadow:0 15px 35px #0008; }
        .ha-hero::before, .ha-hero::after { content:""; position:absolute; inset:0; z-index:-1; border:1px solid #b2afa6; background:var(--photo-echo) center / cover; pointer-events:none; }
        .ha-hero::before { transform:translate(-1.5%, -1.5%); filter:grayscale(1) brightness(.65); }
        .ha-hero::after { transform:translate(1.5%, 1.5%); border-color:#ad823b; filter:brightness(.60) saturate(1.2); }
        .ha-support-1 { grid-area:1/9/2/17; z-index:2; }
        .ha-support-2 { grid-area:2/1/3/9; z-index:2; }
        .ha-support-3 { grid-area:2/8/3/17; z-index:4; }
        .ha-support-2, .ha-support-3 { margin-top:-10px; }
        .ha-layout-reverse .ha-hero { grid-area:1/8/2/17; }
        .ha-layout-reverse .ha-support-1 { grid-area:1/1/2/9; }
        .ha-layout-reverse .ha-support-2 { grid-area:2/9/3/17; }
        .ha-layout-reverse .ha-support-3 { grid-area:2/1/3/10; }
        .ha-layout-fragment .ha-hero { grid-area:2/1/3/10; margin-top:-10px; }
        .ha-layout-fragment .ha-support-1 { grid-area:1/1/2/9; }
        .ha-layout-fragment .ha-support-2 { grid-area:1/8/2/17; margin-top:0; z-index:3; }
        .ha-layout-fragment .ha-support-3 { grid-area:2/9/3/17; z-index:2; }
        .ha-layout-fragment .ha-hero::after { display:none; }
        .ha-layout-final .ha-hero { grid-area:2/8/3/17; margin-top:-10px; }
        .ha-layout-final .ha-support-1 { grid-area:1/1/2/10; z-index:4; }
        .ha-layout-final .ha-support-2 { grid-area:1/9/2/17; margin-top:0; }
        .ha-layout-final .ha-support-3 { grid-area:2/1/3/9; z-index:2; }
        .ha-film { padding:var(--frame-padding); background:#131313; box-shadow:0 10px 20px #0009; }
        .ha-negative-frame { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
        .ha-composition-note { position:absolute; top:12px; right:3vw; z-index:6; display:flex; gap:9px; font:10px 'Courier New',monospace; letter-spacing:.1em; color:var(--accent); text-shadow:0 0 8px #000; }
        .ha-sequence-heading + .ha-composition .ha-composition-note { top:clamp(95px,10vw,141px); }
        .ha-stamp { position:absolute; bottom:8px; right:3vw; z-index:6; pointer-events:none; font-weight:900; font-size:clamp(16px,2.2vw,28px); line-height:1; letter-spacing:-.05em; color:var(--accent); text-shadow:1px 2px 10px #000b; }
        .ha-composition:last-child .ha-stamp { bottom:78px; }
        .ha-composition-footer { position:absolute; bottom:10px; left:3vw; z-index:6; color:#e1dbce; font:9px 'Courier New',monospace; letter-spacing:.1em; text-shadow:0 0 8px #000; }
        .ha-composition:last-child .ha-composition-footer { bottom:80px; }
        .ha-footer { position:relative; margin-top:-70px; min-height:70px; z-index:8; background:linear-gradient(0deg,#080808ed,transparent); color:#e9e6df; }
        @media(max-width:720px) {
          .ha-masthead { font-size:8px; gap:12px; padding:16px 4vw; }
          .ha-credit { white-space:normal; }
          .ha-cover { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); grid-template-rows:auto auto; align-items:center; min-height:100svh; padding:76px 4vw 34px; }
          .ha-cover::before { background:linear-gradient(180deg,#080808b0 0%,#08080831 45%,#080808b5 100%),url("/api/headauto26/texture-kodak-5063-strip.jpeg") center / cover no-repeat; }
          .ha-cover-type { grid-area:1/1/2/7; align-self:start; }
          .ha-cover-type { padding-top:0; }
          .ha-cover h1 { font-size:clamp(36px,11vw,76px); }
          .ha-cover-date, .ha-scroll, .ha-kicker { font-size:9px; }
          .ha-cover-photo { grid-area:2/1/3/7; align-self:start; margin:15px 0 0; }
          .ha-cover-edge { bottom:12px; font-size:8px; }
          .ha-sequence-heading { padding:12px 4vw; display:flex; flex-direction:column; align-items:flex-start; gap:5px; }
          .ha-sequence-heading h2 { font-size:clamp(26px,7.5vw,48px); }
          .ha-heading-grid { width:clamp(108px,32vw,150px); }
          .ha-sequence-heading p { display:none; }
          .ha-composition { grid-template-columns:repeat(6,minmax(0,1fr)); grid-template-rows:repeat(4,auto); padding:30px 2vw; }
          .ha-sequence-heading + .ha-composition { padding-top:130px; }
          .ha-sequence-heading + .ha-composition .ha-composition-note { top:108px; }
          .ha-kodak-strip { width:92%; left:4%; opacity:.32; }
          .ha-layout-reverse .ha-kodak-strip { right:4%; }
          .ha-layout-fragment .ha-kodak-strip { left:0; width:92%; }
          .ha-composition .ha-photo { grid-area:auto; margin-top:0; z-index:3; }
          .ha-composition .ha-photo:nth-of-type(1) { grid-area:1/1/2/6; }
          .ha-composition .ha-photo:nth-of-type(2) { grid-area:2/2/3/7; margin-top:-12px; z-index:4; }
          .ha-composition .ha-photo:nth-of-type(3) { grid-area:3/1/4/6; margin-top:-12px; z-index:5; }
          .ha-composition .ha-photo:nth-of-type(4) { grid-area:4/2/5/7; margin-top:-12px; z-index:6; }
          .ha-composition-note { font-size:8px; }
          .ha-stamp { font-size:14px; }
          .ha-composition-footer { font-size:7px; }
          .ha-contact-overlay { width:180%; left:-40%; }
          .ha-footer { font-size:8px; padding:18px 4vw; margin-top:-65px; min-height:65px; }
        }
        @media(prefers-reduced-motion:reduce) { .ha-mural * { scroll-behavior:auto !important; } }
      `}</style>
    </>
  );
}
