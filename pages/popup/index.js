
import React, { useRef, useState } from 'react';
import Head from 'next/head';
import PopupHero from '@/components/PopupHero';
import PopupProductCard from '@/components/PopupProductCard';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function PopupShop({ products }) {
const shopPageRef = useRef(null);
useSmoothScroll('#popup', shopPageRef);

return (
<div className="bg-white text-black w-full min-h-screen transition-colors duration-300">
<Head>
<title>Popup Shop</title>
<meta name="description" content="Shop exclusive popup items" />
</Head>

<PopupHero />

<main
id="popup"
ref={shopPageRef}
className="max-w-[1440px] mx-auto px-4 py-16 bg-white text-black transition-colors duration-300"
>
<div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
{products.map((product) => (
<PopupProductCard key={product.id} product={product} />
))}
</div>
</main>
</div>
);
}

export async function getStaticProps() {
const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const graphqlQuery = {
query: `
query getPopupProducts {
collectionByHandle(handle: "popup-shop") {
products(first: 100) {
edges {
node {
id
title
handle
description
availableForSale
images(first: 10) {
edges {
node {
src
altText
}
}
}
variants(first: 10) {
edges {
node {
id
title
availableForSale
image { src }
selectedOptions {
name
value
}
priceV2 {
amount
currencyCode
}
}
}
}
}
}
}
}
}
`,
};

try {
const res = await fetch(endpoint, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'X-Shopify-Storefront-Access-Token': token,
},
body: JSON.stringify(graphqlQuery),
});

if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

const responseJson = await res.json();
const products = responseJson.data.collectionByHandle.products.edges.map(({ node }) => {
const variants = node.variants.edges.map((v) => v.node);

const defaultVariant =
variants.find((v) =>
v.selectedOptions?.some(
(opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === 'regular'
)
) || variants[0];

return {
id: node.id,
title: node.title,
handle: node.handle,
description: node.description,
availableForSale: node.availableForSale,
imageSrc: node.images.edges[0]?.node.src || '/fallback-image.jpg',
altImageSrc: node.images.edges[1]?.node.src || null,
imageAlt: node.images.edges[0]?.node.altText || 'Product Image',
allImages: node.images.edges.map((edge) => edge.node.src),
variantOptions: variants.map((v) => ({
id: v.id,
title: v.title,
price: v.priceV2,
availableForSale: v.availableForSale,
image: v.image,
selectedOptions: v.selectedOptions,
})),
defaultVariantId: defaultVariant.id,
};
});

return { props: { products } };
} catch (error) {
console.error('Error fetching popup products:', error);
return { props: { products: [] } };
}
}
