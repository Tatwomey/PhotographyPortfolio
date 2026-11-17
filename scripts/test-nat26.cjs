const assert = require('node:assert/strict');
const fs = require('node:fs');
const {createRequire} = require('node:module');
const req = createRequire(process.cwd() + '/package.json');
const {encode} = req('next-auth/jwt');
req('dotenv').config({path:'.env.local'});
const {chromium} = require('playwright');
const sharp = require('sharp');
const base = 'http://localhost:3100';
async function main() {
 const cookie = async allowedPages => 'next-auth.session-token=' + await encode({secret:process.env.NEXTAUTH_SECRET,token:{allowedPages},maxAge:600});
 const authorized = await cookie(['/music/nat26']);
 const wrong = await cookie(['/music/headauto26']);
 assert.equal((await fetch(base+'/music/nat26',{redirect:'manual'})).status,307);
 for(const headers of [{},{cookie:wrong},{cookie:'next-auth.session-token=invalid'}]) {
  assert.equal((await fetch(base+'/api/nat26/nat.jpg?download=small-web',{headers})).status,401);
 }
 const files=JSON.parse(fs.readFileSync('data/nat26-files.json'));
 for(const file of files) {
  assert.equal((await fetch(base+'/nat26/'+file)).status,404);
  for(const variant of ['display','small-web']) {
   const res=await fetch(base+'/api/nat26/'+file+(variant==='small-web'?'?download=small-web':''),{headers:{cookie:authorized}});
   assert.equal(res.status,200); assert.equal(res.headers.get('cache-control'),'private, no-store');
   const bytes=Buffer.from(await res.arrayBuffer());
   assert.deepEqual(bytes,fs.readFileSync('assets/nat26/'+variant+'/'+file));
   const meta=await sharp(bytes).metadata();
   assert.equal(Math.max(meta.width,meta.height),variant==='display'? Math.min(2560,Math.max((await sharp('assets/nat26/originals/'+file).metadata()).width,(await sharp('assets/nat26/originals/'+file).metadata()).height)):1600);
   assert.equal(meta.space,'srgb'); assert.equal(meta.exif,undefined);
   if(variant==='small-web') assert.match(res.headers.get('content-disposition'),/attachment; filename="Natalia-Clavier-.*-small-web.jpg"/);
  }
 }
 for(const suffix of ['missing.jpg','nat.jpg?download=original','nat.jpg?download=small-web&download=original','%2E%2E%2F%2E%2E%2F.env.local']) assert.equal((await fetch(base+'/api/nat26/'+suffix,{headers:{cookie:authorized}})).status,404);
 assert.equal((await fetch(base+'/api/nat26/nat.jpg',{method:'POST',headers:{cookie:authorized}})).status,405);
 const head=await fetch(base+'/api/nat26/nat.jpg?download=small-web',{method:'HEAD',headers:{cookie:authorized}}); assert.equal(head.status,200); assert.equal((await head.arrayBuffer()).byteLength,0);
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const context=await browser.newContext({acceptDownloads:true});
  await context.addCookies([{name:'next-auth.session-token',value:authorized.split('=')[1],url:base}]);
  await context.route('**/*',route=>new URL(route.request().url()).origin===base ? route.continue() : route.abort());
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/music/nat26');
  assert.equal(await page.locator('[data-nat26-photo-index]').count(),13);
  await page.getByRole('button',{name:'Enlarge Natalia Clavier cover photograph'}).click();
  for(let i=0;i<13;i++) {
   const link=page.getByRole('link',{name:'Download Small Web'});
   const src=await page.locator('dialog img').getAttribute('src');
   assert.equal(await link.getAttribute('href'),src+'?download=small-web');
   const downloadPromise=page.waitForEvent('download'); await link.click(); const download=await downloadPromise;
   assert.equal(await download.failure(),null);
   assert.equal(download.suggestedFilename(),'Natalia-Clavier-'+src.split('/').at(-1).replace('.jpg','-small-web.jpg'));
   await page.getByRole('button',{name:'Next photograph'}).click();
  }
  await page.keyboard.press('ArrowLeft'); assert.match(await page.locator('dialog img').getAttribute('src'),/natglitch.jpg$/);
  await page.keyboard.press('Escape'); assert.equal(await page.locator('dialog').evaluate(el=>el.open),false);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  const events=await page.evaluate(()=>window.dataLayer.filter(e=>e.event==='photo_download'));
  assert.equal(events.length,13); assert.equal(new Set(events.map(e=>e.photo_id)).size,13);
  for(const width of [1440,390,320]) {
   await page.setViewportSize({width,height:900});
   await page.getByRole('button',{name:'Enlarge Natalia Clavier cover photograph'}).click();
   await page.locator('dialog img').evaluate(img=>img.decode());
   const bounds=await page.getByRole('link',{name:'Download Small Web'}).boundingBox();
   assert.ok(bounds.x>=0 && bounds.x+bounds.width<=width && bounds.y+bounds.height<=900);
   await page.screenshot({path:'/tmp/nat26-'+width+'.png'});
   await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
 console.log('PASS: 13 display images, 13 JPEG downloads, access controls, invalid paths, desktop/mobile viewer, keyboard navigation, download analytics.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
