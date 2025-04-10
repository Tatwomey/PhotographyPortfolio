// pages/popup/[slug].js

import ProductSlugLayout from '@/components/ProductSlugLayout';

// This uses the shared fetch logic from the utility file
export { getStaticPaths, getStaticProps } from '@/lib/shopSlugUtils';

export default function PopupSlug({ product }) {
  return <ProductSlugLayout product={product} />;
}
