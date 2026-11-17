import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {randomBytes,scryptSync,createHash} from 'node:crypto';import {encode} from 'next-auth/jwt';import {canViewHeadAuto,isHeadAutoEnabled} from '../utils/headauto26-access.mjs';import {authorizeHeadAutoCredentials} from '../utils/headauto26-credentials.mjs';
const chapters=JSON.parse(fs.readFileSync('data/headauto26.json')),photos=chapters.flatMap(c=>c.photos),hasKey=fs.existsSync('.env.headauto26.local'),local=hasKey?JSON.parse(fs.readFileSync('.env.headauto26.local')):{HEADAUTO26_USERNAME:'gallery-test',HEADAUTO26_ENABLED:'true',HEADAUTO26_IMAGE_KEY:'00'.repeat(32)};Object.assign(process.env,local,{NEXTAUTH_SECRET:'local-test-secret-only',NEXTAUTH_URL:'http://localhost:3000'});
const req=token=>({cookies:token?{'next-auth.session-token':token}:{},headers:{}});
test('real encrypted NextAuth tokens enforce exact gallery permission',async()=>{assert.equal(await canViewHeadAuto(req()),false);assert.equal(await canViewHeadAuto(req('invalid')),false);for(const [pages,expected] of [[['/music/headauto26'],true],[['/music/iamx25'],false],[['/music/headauto26-other'],false]]){const token=await encode({secret:process.env.NEXTAUTH_SECRET,token:{allowedPages:pages}});assert.equal(await canViewHeadAuto(req(token)),expected);}const expired=await encode({secret:process.env.NEXTAUTH_SECRET,maxAge:-120,token:{allowedPages:['/music/headauto26']}});assert.equal(await canViewHeadAuto(req(expired)),false);});
test('gallery credentials reject wrong passwords and preserve scoped access',()=>{const password=randomBytes(24).toString('hex'),salt=randomBytes(16),old=process.env.HEADAUTO26_PASSWORD_SCRYPT;process.env.HEADAUTO26_PASSWORD_SCRYPT=salt.toString('hex')+':'+scryptSync(password,salt,64).toString('hex');const input={username:local.HEADAUTO26_USERNAME,password};assert.deepEqual(authorizeHeadAutoCredentials(input).allowedPages,['/music/headauto26']);assert.equal(authorizeHeadAutoCredentials({...input,password:'wrong'}),null);assert.equal(authorizeHeadAutoCredentials(null),null);process.env.HEADAUTO26_ENABLED='false';assert.equal(authorizeHeadAutoCredentials(input),null);assert.equal(isHeadAutoEnabled(),false);Object.assign(process.env,local,{HEADAUTO26_PASSWORD_SCRYPT:old});});
test('the updated sequence contains all fourteen protected additions and excludes the removed photos', () => {
  assert.equal(photos.length, 24);
  assert.equal(new Set(photos.map(p => p.id)).size, 24);
  assert(!photos.some(p => ['960a2933', '960a2889', '960a3210', '960a3559', '960a3578'].includes(p.id)));
  assert.equal(photos.filter(p => p.protected).length, 14);
  assert(photos.find(p => p.id === 'headautomatica2')?.protected);
  assert.deepEqual(chapters.map(chapter => chapter.id), ['signal']);
  assert.equal(photos.filter(p => p.coverOnly).length, 1);
  assert.equal(photos.find(p => p.id === 'headautomatica2').coverOnly, true);
});
import { decryptHeadAutoImage } from '../utils/headauto26-images.mjs';
const imageKey = process.env.HEADAUTO26_ADDITIONS_KEY;
test('all exports retain their original checksums and new exports are not public', () => {
  for (const p of photos) {
    if (p.protected) assert(!fs.existsSync('public/headauto26/' + p.export));
    let bytes;
    if (p.protected) {
      const encrypted = fs.readFileSync('assets/headauto26/' + p.export + '.enc');
      assert.equal(encrypted.length, p.bytes + 28, p.export);
      assert.throws(() => decryptHeadAutoImage(encrypted, p.export, '00'.repeat(32)));
      const key = p.keyVersion === "v2" ? process.env.HEADAUTO26_ADDITIONS_V2_KEY : p.keyVersion === "signal" ? process.env.HEADAUTO26_SIGNAL_KEY : imageKey;
      if (!key) continue;
      bytes = decryptHeadAutoImage(encrypted, p.export, key);
    } else {
      bytes = fs.readFileSync('public/headauto26/' + p.export);
    }
    assert.equal(bytes.length, p.bytes, p.export);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), p.sha256, p.export);
  }
});
