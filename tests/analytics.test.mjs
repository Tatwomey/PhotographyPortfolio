import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cartPayload, addedLines, trackCartEvent, navigateToCheckout} from '../lib/ecommerce.mjs';
import {leadPayload} from '../lib/lead.mjs';
const line = (id, quantity, price, currencyCode='USD') => ({id:'line-'+id,quantity,cost:{totalAmount:{amount:String(quantity*price),currencyCode}},merchandise:{id:'gid://shopify/ProductVariant/'+id,title:'8 x 10',priceV2:{amount:String(price),currencyCode},product:{title:'Photo '+id}}});
const cart = (...lines) => ({id:'cart-1',checkoutUrl:'https://store.myshopify.com/checkouts/example',lines:{edges:lines.map(node=>({node}))}});

test('cart values include all items and actual quantities at returned discounted prices',()=>{
 const payload=cartPayload(cart(line('1',2,12.5),line('2',1,40)));
 assert.equal(payload.value,65);assert.equal(payload.currency,'USD');assert.equal(payload.items.length,2);assert.equal(payload.items[0].quantity,2);
});
test('add/remove deltas do not count existing cart quantities again',()=>{
 const before=cart(line('1',2,12.5),line('2',1,40));const after=cart(line('1',3,12.5),line('2',1,40));
 assert.equal(cartPayload(after,addedLines(before,after,'gid://shopify/ProductVariant/1')).value,12.5);
 assert.equal(cartPayload(before,addedLines(after,before,'gid://shopify/ProductVariant/1')),null);
 assert.equal(cartPayload(after,addedLines(before,before,'gid://shopify/ProductVariant/1')),null);
 assert.equal(cartPayload(after,addedLines(before,after,'gid://shopify/ProductVariant/2')),null);
});
test('invalid and mixed-currency carts do not emit misleading totals',()=>{
 assert.equal(cartPayload(cart()),null);
 assert.equal(cartPayload(cart(line('1',1,2,'USD'),line('2',1,3,'CAD'))),null);
 assert.equal(cartPayload(cart(line('1',1,NaN))),null);
});
test('events clear stale ecommerce values and omit URL query data',()=>{
 global.window={dataLayer:[],location:{pathname:'/cart',origin:'https://example.com',href:'https://example.com/cart?email=private'}};
 trackCartEvent('view_cart',cart(line('1',1,5)));
 assert.equal(window.dataLayer.length,2);assert.equal(window.dataLayer[0].items,null);assert.equal(window.dataLayer[1].value,5);assert.equal(window.dataLayer[1].page_location,'https://example.com/cart');
 delete global.window;
});
test('checkout uses the full fresh cart, single navigation callback, and explicit owner',()=>{
 const destinations=[];global.window={dataLayer:[],location:{pathname:'/cart',origin:'https://example.com',assign:url=>destinations.push(url)}};
 const active=cart(line('1',2,10),line('2',1,5));assert.equal(navigateToCheckout(active),true);
 let event=window.dataLayer.at(-1);assert.equal(event.event,'begin_checkout');assert.equal(event.value,25);event.eventCallback();event.eventCallback();assert.equal(destinations.length,1);
 navigateToCheckout(active,'shopify');event=window.dataLayer.at(-1);assert.equal(event.event,'checkout_click');event.eventCallback();
 assert.equal(navigateToCheckout(cart()),false);assert.equal(navigateToCheckout({...active,checkoutUrl:'javascript:alert(1)'}),false);assert.equal(navigateToCheckout({...active,checkoutUrl:'bad-url'}),false);
 delete global.window;
});
test('checkout still navigates after timeout when tags never call back',async()=>{
 const destinations=[];global.window={dataLayer:[],location:{pathname:'/cart',origin:'https://example.com',assign:url=>destinations.push(url)}};
 navigateToCheckout(cart(line('1',1,5)));await new Promise(resolve=>setTimeout(resolve,750));assert.equal(destinations.length,1);delete global.window;
});
test('lead listener scopes form, distinguishes submitted status, and only accepts known artist values',()=>{
 const location={pathname:'/capsule-01',origin:'https://example.com'};
 assert.equal(leadPayload({type:'open',formId:'SyxgXY'},location),null);
 assert.equal(leadPayload({type:'submit'},location),null);
 assert.equal(leadPayload({type:'submit',formId:'other'},location),null);
 const event=leadPayload({type:'submit',formId:'SyxgXY',metaData:{email:'private@example.com',phone_number:'12345',band_interest:'Korn'}},location);
 assert.equal(event.signup_status,'submitted');assert.equal(event.email_submitted,true);assert.equal(event.sms_submitted,true);assert.equal(event.band_interest,'korn');assert.equal(event.email_opt_in,undefined);assert.ok(!JSON.stringify(event).includes('private@example.com'));assert.ok(!JSON.stringify(event).includes('12345'));
 assert.equal(leadPayload({type:'submit',formId:'SyxgXY',metaData:{band_interest:'private@example.com'}},location).band_interest,null);
});
const shopifySource=fs.readFileSync(new URL('../lib/shopify.js',import.meta.url),'utf8');
const shopify=await import('data:text/javascript;base64,'+Buffer.from(shopifySource).toString('base64'));
test('Shopify userErrors reject add, remove, update, and create even if a cart was returned',async()=>{
 const original=global.fetch;
 try {
  for(const [operation,invoke] of [
   ['cartCreate',()=>shopify.createCart()],
   ['cartLinesAdd',()=>shopify.addItemToCart({cartId:'cart-1',variantId:'v1',quantity:1})],
   ['cartLinesRemove',()=>shopify.removeItemFromCart('cart-1','line-1')],
   ['cartLinesUpdate',()=>shopify.updateCartItemQuantity('cart-1','line-1',2)]]) {
    global.fetch=async(_url,options)=>{assert.match(JSON.parse(options.body).query,/userErrors/);return {ok:true,json:async()=>({data:{[operation]:{cart:cart(line('1',1,5)),userErrors:[{message:'Sold out'}]}}})};};
    await assert.rejects(invoke,/Sold out/);
  }
 }finally {global.fetch=original;}
});
test('successful add returns authoritative cart including checkout URL; expired lookup is null',async()=>{
 const original=global.fetch;const updated=cart(line('1',1,9));
 try {
  global.fetch=async()=>({ok:true,json:async()=>({data:{cartLinesAdd:{cart:updated,userErrors:[]}}})});
  assert.deepEqual(await shopify.addItemToCart({cartId:'cart-1',variantId:'v1',quantity:1}),updated);
  global.fetch=async()=>({ok:true,json:async()=>({data:{cart:null}})});
  assert.equal(await shopify.fetchCart('expired'),null);
 }finally {global.fetch=original;}
});
test('blocked analytics cannot turn a successful cart operation into an error',()=>{
 global.window={dataLayer:{push(){throw new Error('blocked');}},location:{pathname:'/cart',origin:'https://example.com'}};
 assert.doesNotThrow(()=>trackCartEvent('add_to_cart',cart(line('1',1,5))));delete global.window;
});
test('incomplete and oversized carts omit analytics totals',()=>{
 assert.equal(cartPayload({...cart(line('1',1,5)),lines:{...cart(line('1',1,5)).lines,pageInfo:{hasNextPage:true}}}),null);
 assert.equal(cartPayload(cart(...Array.from({length:201},(_,i)=>line(String(i),1,5)))),null);
});
