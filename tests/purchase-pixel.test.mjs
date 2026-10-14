import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../integrations/shopify/ga4-purchase-pixel.js',import.meta.url),'utf8');
function run(checkout){let handler;const window={dataLayer:[]};const document={getElementsByTagName:()=>[],createElement:()=>({}),head:{appendChild(){}}};
 vm.runInNewContext(source,{window,document,analytics:{subscribe:(name,callback)=>{assert.equal(name,'checkout_completed');handler=callback;}}});
 handler({id:'event-random',data:{checkout},context:{window:{location:{origin:'https://shop.example.com',href:'https://shop.example.com/checkouts/secret?email=private'}}}});
 return window.dataLayer.filter(x=>x.event==='purchase');}
const checkout={order:{id:'gid://shopify/Order/123'},currencyCode:'USD',subtotalPrice:{amount:100},totalPrice:{amount:123},totalTax:{amount:8},shippingLine:{price:{amount:15}},lineItems:[{quantity:2,finalLinePrice:{amount:100},variant:{id:'gid://shopify/ProductVariant/1',price:{amount:50},product:{title:'Print'}}}]};
test('purchase unit price divides line total and revenue excludes shipping/tax',()=>{const [event]=run(checkout);assert.equal(event.value,100);assert.equal(event.items[0].price,50);assert.equal(event.items[0].quantity,2);assert.equal(event.shipping,15);assert.equal(event.tax,8);assert.equal(event.transaction_id,checkout.order.id);assert.ok(!JSON.stringify(event).includes('secret'));});
test('zero subtotal stays zero and missing money does not become fabricated revenue',()=>{assert.equal(run({...checkout,subtotalPrice:{amount:0}})[0].value,0);assert.equal(run({...checkout,subtotalPrice:null}).length,0);});
test('invalid quantity and missing stable transaction ID are not sent',()=>{assert.equal(run({...checkout,order:null}).length,0);assert.equal(run({...checkout,lineItems:[{...checkout.lineItems[0],quantity:0}]}).length,0);});
