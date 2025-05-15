import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useShopContext } from '@/contexts/shopContext';

export default function PopupProductQuickView({ product, onClose }) {
const { handleAddToCart } = useShopContext();
const [selectedImageIndex, setSelectedImageIndex] = useState(0);
const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.id || '');

useEffect(() => {
setSelectedImageIndex(0);
setSelectedVariant(product.variants?.[0]?.id || '');
}, [product]);

if (!product || !product.images?.length) return null;

const handleClose = (e) => {
if (e.target.id === 'overlay') onClose();
};

const price = product.variants?.[0]?.price || '0.00';

return (
<div
id="overlay"
onClick={handleClose}
className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
>
<div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-lg shadow-xl flex flex-col md:flex-row relative">
{/* Close */}
<button
onClick={onClose}
className="absolute top-3 right-3 bg-white p-1 rounded-full shadow z-10"
aria-label="Close Modal"
>
<X className="w-6 h-6 text-black" />
</button>

{/* Image Section */}
<div className="w-full md:w-1/2 flex flex-col items-center p-4">
<div className="relative w-full aspect-[4/5] max-w-[480px] bg-white flex items-center justify-center rounded">
<Image
src={product.images[selectedImageIndex].src}
alt={product.title}
fill
className="object-contain rounded"
sizes="(max-width: 768px) 100vw, 50vw"
priority
/>
{product.images.length > 1 && (
<>
<button
onClick={() =>
setSelectedImageIndex((prev) =>
prev === 0 ? product.images.length - 1 : prev - 1
)
}
className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
>
<ArrowLeft className="w-5 h-5 text-black" />
</button>
<button
onClick={() =>
setSelectedImageIndex((prev) =>
prev === product.images.length - 1 ? 0 : prev + 1
)
}
className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
>
<ArrowRight className="w-5 h-5 text-black" />
</button>
</>
)}
</div>

{product.images.length > 1 && (
<div className="flex gap-2 mt-4 overflow-x-auto px-2">
{product.images.map((img, i) => (
<Image
key={i}
src={img.src}
alt={`Thumbnail ${i + 1}`}
width={64}
height={80}
onClick={() => setSelectedImageIndex(i)}
className={`rounded-md cursor-pointer border object-cover ${
selectedImageIndex === i ? 'border-black' : 'border-transparent'
}`}
/>
))}
</div>
)}
</div>

{/* Info Section */}
<div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
<div>
<h1 className="text-lg sm:text-xl font-semibold leading-tight mb-2 truncate">
{product.title}
</h1>
<p className="text-lg text-gray-700 mb-4">${parseFloat(price).toFixed(2)}</p>

{product.variants?.length > 0 && (
<>
<label htmlFor="variant" className="block text-sm font-medium text-gray-600 mb-1">
Edition / Size
</label>
<select
id="variant"
value={selectedVariant}
onChange={(e) => setSelectedVariant(e.target.value)}
className="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-4"
>
{product.variants.map((variant, index) => (
<option key={index} value={variant.id}>
{variant.title}
</option>
))}
</select>
</>
)}

<button
onClick={() => {
handleAddToCart(selectedVariant, 1);
onClose();
}}
className="w-full bg-black text-white py-2 rounded mb-2 hover:bg-gray-800 text-sm font-medium"
>
Add to Cart
</button>
<button
onClick={() => {
handleAddToCart(selectedVariant, 1);
window.location.href = '/checkout';
}}
className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 text-sm font-medium"
>
Buy It Now
</button>

<p className="text-xs text-center text-gray-500 mt-2">
Limited to 2 units per customer.
</p>
</div>

{/* View Details - Better Placement + Animation */}
<div className="mt-6 text-center">
<Link href={`/popup/${product.handle}`} legacyBehavior>
<a className="relative inline-block text-sm font-medium text-black group">
VIEW PRODUCT DETAILS
<span className="absolute left-0 -bottom-1 w-full h-[2px] bg-black transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out"></span>
</a>
</Link>
</div>
</div>
</div>
</div>
);
}
