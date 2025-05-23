import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopContext } from "@/contexts/shopContext";
import Hero from "@/components/Hero";
import TabSection from "@/components/TabSection";

export default function ProductSlugLayout({ product }) {
const { handleAddToCart } = useShopContext();
const router = useRouter();

if (!product || !product.variants) {
return <div className="text-center py-20 text-lg">Loading product...</div>;
}

const colorOptions = Array.from(
new Set(
product.variants
.map((v) =>
v.selectedOptions.find((opt) => opt.name.toLowerCase() === "color")?.value
)
.filter(Boolean)
)
);

const defaultVariant =
product.variants.find((v) =>
v.selectedOptions.some(
(opt) => opt.name.toLowerCase() === "color" && opt.value.toLowerCase() === "regular"
)
) || product.variants[0];

const [selectedColor, setSelectedColor] = useState(
defaultVariant.selectedOptions.find((opt) => opt.name.toLowerCase() === "color")?.value
);
const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
const [mainImage, setMainImage] = useState(defaultVariant.image?.src || product.images[0]?.src);
const [currentImageIdx, setCurrentImageIdx] = useState(0);

const variantsForColor = product.variants.filter((v) =>
v.selectedOptions.some(
(opt) => opt.name.toLowerCase() === "color" && opt.value === selectedColor
)
);

useEffect(() => {
const variant = variantsForColor[0];
if (variant) {
setSelectedVariant(variant);
setMainImage(variant.image?.src || product.images[0]?.src);
setCurrentImageIdx(0);
}
}, [selectedColor]);

const handleVariantChange = (e) => {
const variant = product.variants.find((v) => v.id === e.target.value);
if (variant) {
setSelectedVariant(variant);
setMainImage(variant.image?.src || product.images[0]?.src);
const newColor = variant.selectedOptions.find((opt) => opt.name.toLowerCase() === "color");
if (newColor?.value) {
setSelectedColor(newColor.value);
}
}
};

const handleBuyNow = async () => {
await handleAddToCart(selectedVariant.id, 1);
router.push("/checkout");
};

const handleNotifyClick = () => {
if (window._klOnsite) {
window._klOnsite.push(["openForm", "RjNi3C"]);
}
};

const nextImage = () => {
const newIdx = (currentImageIdx + 1) % product.images.length;
setCurrentImageIdx(newIdx);
setMainImage(product.images[newIdx].src);
};

const prevImage = () => {
const newIdx = (currentImageIdx - 1 + product.images.length) % product.images.length;
setCurrentImageIdx(newIdx);
setMainImage(product.images[newIdx].src);
};

return (
<>
<Hero />
<main className="bg-white text-black px-4 py-12 container mx-auto">
<div id="product-details" className="flex flex-col lg:flex-row gap-10 scroll-mt-20 items-start">

{/* Image Column */}
<div className="w-full lg:max-w-[550px] relative">
<div className="relative aspect-[4/5] w-full overflow-hidden rounded shadow group">
{product.images.length > 1 && (
<>
<button onClick={prevImage} className="modal-arrow left" aria-label="Prev Image">
<ChevronLeft />
</button>
<button onClick={nextImage} className="modal-arrow right" aria-label="Next Image">
<ChevronRight />
</button>
</>
)}
<Image
src={mainImage}
alt={product.title}
fill
className="object-contain"
priority
/>
{!selectedVariant.availableForSale && (
<div className="sold-out-badge">Sold Out</div>
)}
</div>

{product.images.length > 1 && (
<div className="flex gap-3 mt-4 overflow-x-auto">
{product.images.map((img, idx) => (
<button
key={idx}
onClick={() => {
setMainImage(img.src);
setCurrentImageIdx(idx);
}}
className={`border rounded-md overflow-hidden ${
currentImageIdx === idx ? "border-black" : "border-gray-300"
}`}
aria-label={`Thumbnail ${idx + 1}`}
>
<Image
src={img.src}
alt={`Thumbnail ${idx}`}
width={80}
height={100}
className="thumbnail-image"
/>
</button>
))}
</div>
)}
</div>

{/* Details Column */}
<div className="w-full lg:max-w-md">
<nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
<ol className="flex space-x-2">
<li>
<Link href="/popup" className="hover:underline">
Popup Shop
</Link>
<span className="mx-1">/</span>
</li>
<li className="text-black font-medium truncate">{product.title}</li>
</ol>
</nav>

<h1 className="text-3xl font-bold mb-2">{product.title}</h1>
{product.description && (
<p className="text-sm italic text-gray-600 mb-4">{product.description}</p>
)}
<p className="text-xl font-semibold mb-4">
${parseFloat(selectedVariant?.priceV2?.amount || 0).toFixed(2)}
</p>

{selectedVariant.quantityAvailable <= 3 &&
selectedVariant.quantityAvailable > 0 && (
<p className="text-sm text-red-600 font-semibold mt-1">
Only {selectedVariant.quantityAvailable} left in stock!
</p>
)}

{colorOptions.length > 1 && (
<div className="mb-4">
<label className="block text-sm font-medium mb-1">Color</label>
<div className="flex gap-2">
{colorOptions.map((color) => (
<button
key={color}
onClick={() => setSelectedColor(color)}
className={`w-6 h-6 rounded-full border-2 ${
selectedColor === color
? "border-black ring-2 ring-black"
: "border-gray-300"
}`}
style={{
backgroundColor:
color.toLowerCase() === "monochrome" ? "#000" : "#e5e5e5",
}}
aria-label={color}
/>
))}
</div>
</div>
)}

{variantsForColor.length > 1 && (
<div className="mb-4">
<label className="block text-sm font-medium mb-1">Edition / Size</label>
<select
value={selectedVariant.id}
onChange={handleVariantChange}
className="w-full border rounded p-2"
>
{variantsForColor.map((v) => (
<option key={v.id} value={v.id}>
{v.title}
</option>
))}
</select>
</div>
)}

{/* CTA */}
<div className="space-y-3 mb-6">
{selectedVariant.availableForSale ? (
<>
<button
onClick={() => handleAddToCart(selectedVariant.id, 1)}
className="w-full bg-black text-white py-3 rounded text-lg font-medium"
>
Add to Cart
</button>
<button
onClick={handleBuyNow}
className="w-full bg-black text-white py-3 rounded text-lg font-semibold hover:bg-gray-800"
>
Buy It Now
</button>
</>
) : (
<button
onClick={handleNotifyClick}
className="w-full border border-black py-3 rounded text-lg font-semibold hover:bg-gray-100"
>
Notify Me When Back in Stock
</button>
)}
</div>

<TabSection details={product.description} />
</div>
</div>
</main>
</>
);
}
